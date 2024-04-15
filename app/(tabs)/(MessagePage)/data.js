
import { firestore } from '../../../firebaseConfig';

import { getFirestore, updateDoc, arrayUnion, collection, query, orderBy, limit, onSnapshot, serverTimestamp, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

class Fire {

  constructor() {

    this.db = firestore;
  }
  // 1.
  get ref() {
    return collection(this.db, 'Chat');
  }
  // 2.
  on = (chatId, callback) => {
    const messagesRef = collection(this.ref, chatId, "Messages");

    const q = query(
      messagesRef,
      orderBy('timestamp', 'asc'),
      limit(20)
    );


    this.unsubscribe = onSnapshot(q, snapshot => {

      snapshot.docChanges().forEach(change => {

        if (change.type === 'added') {

          callback(this.parse(change.doc));

        }
      });
    });
  }
  // 3.
  parse = document => {
    const data = document.data();
    const _id = document.id;
    console.log(data.timestamp);
    const timestamp = data.timestamp ? data.timestamp.toDate() : new Date(); // Fallback to client-side timestamp

    const { text, user } = data;

    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  // 4.
  off() {
    if (this.unsubscribe) this.unsubscribe();
  }


  // Send messages
  get timestamp() {
    return serverTimestamp();
  }


  send = (messages, userId, receiveUser) => {
    console.log("senderId:", userId);
    console.log("receiverId:", receiveUser.uid);
    chatId = generateChatId(userId, receiveUser.uid);

    for (let i = 0; i < messages.length; i++) {
      const { text } = messages[i];

      const message = {
        text,
        user: { _id: userId },
        timestamp: this.timestamp,
      };
      this.append(message, chatId, userId, receiveUser);
    }
  };


  append = async (message, chatId, userId, receiveUser) => {
    try {

      // Reference to the specific chat document
      const chatRef = doc(this.db, 'Chat', chatId);

      // Reference to the 'Messages' subcollection of the chat
      const messagesRef = collection(chatRef, 'Messages');

      const docRef = await addDoc(messagesRef, message);
      console.log("Message written with ID: ", docRef.id);

      // Update the 'newestMessage' and 'timestamp' field of the chat document with the text of the new message
      await updateDoc(chatRef, {
        newestMessage: message.text,
        timestamp: serverTimestamp()
      });

      await updateMessaging(doc(this.db, "Users", userId), receiveUser.uid, true);
      await updateMessaging(doc(this.db, "Users", receiveUser.uid), userId, false);

    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
}







// Function to ensure user IDs are ordered consistently
// This could be alphabetical, numerical, or any other consistent method
export function generateChatId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}


// Helper function to update the currentlyMessaging field
export const updateMessaging = async (userDocRef, otherUserId, readStatus) => {
  const userDoc = await getDoc(userDocRef);

  const userData = userDoc.data();
  const currentlyMessaging = userData.CurrentlyMessaging || [];

  // Create a new array for updated currentlyMessaging data
  let updatedMessaging = currentlyMessaging.filter(entry => entry.userId !== otherUserId);
  updatedMessaging.push({ userId: otherUserId, timeAsNumber: Date.now(), haveRead: readStatus });

  // Update the document with the modified currentlyMessaging array
  await updateDoc(userDocRef, { CurrentlyMessaging: updatedMessaging });
};

// Helper function to update the haveRead field in the currentlyMessaging array
export const updateHaveReadStatus = async (userDocRef, otherUserId) => {
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();
  const currentlyMessaging = userData.CurrentlyMessaging || [];

  // Map through the currentlyMessaging data to update the haveRead status for a specific userId
  const updatedMessaging = currentlyMessaging.map(entry => {
    if (entry.userId === otherUserId) {
      return { ...entry, haveRead: true }; // Set haveRead to true
    }
    return entry; // Return unmodified entry if not the target user
  });

  // Update the document with the modified currentlyMessaging array
  await updateDoc(userDocRef, { CurrentlyMessaging: updatedMessaging });
};


// Function to find or create a chat document
export async function findOrCreateChat(userId1, userId2) {
  const chatId = generateChatId(userId1, userId2);

  const chatRef = doc(firestore, 'Chat', chatId);
  const docSnap = await getDoc(chatRef);

  if (!docSnap.exists()) {
    // Chat doesn't exist, create a new one
    await setDoc(chatRef, {
      participants: [userId1, userId2],
      timestamp: serverTimestamp(),
      newestMessage: ""
    });

    console.log('New chat created with ID:', chatId);

    const db = firestore;
    const user1DocRef = doc(db, "Users", userId1);
    const user2DocRef = doc(db, "Users", userId2);



    // Save each others chatId in the CurrentlyMessaging

    await updateMessaging(user1DocRef, userId2, true);
    await updateMessaging(user2DocRef, userId1, false);

    console.log("Updated Currently messaging for both users", userId1, userId2);
  } else {
    // If session already exists, once the user press into the chat page, change the readStatus to mark read.
    updateHaveReadStatus(doc(firestore, "Users", userId1), userId2, true);
    console.log('Chat found with ID:', chatId);
  }

  return chatId; // Return the chatId for further use (e.g., sending messages)
}

Fire.shared = new Fire();

export default Fire;