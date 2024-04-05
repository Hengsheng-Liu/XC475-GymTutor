
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
      orderBy('timestamp', 'desc'),
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
      this.append(message, chatId);
    }
  };


  append = async (message, chatId) => {
    try {

      // Reference to the specific chat document
      const chatRef = doc(this.db, 'Chat', chatId);

      // Reference to the 'Messages' subcollection of the chat
      const messagesRef = collection(chatRef, 'Messages');

      const docRef = await addDoc(messagesRef, message);
      console.log("Message written with ID: ", docRef.id);

      // Update the 'newestMessage' field of the chat document with the text of the new message
      await updateDoc(chatRef, {
        newestMessage: message.text
      });
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

    // Save each others chatId in the currentlyMessaging

    await updateDoc(user1DocRef, { currentlyMessaging: arrayUnion(userId2) });
    await updateDoc(user2DocRef, { currentlyMessaging: arrayUnion(userId1) });
    console.log("Updated Currently messaging for both users", userId1, userId2);
  } else {
    console.log('Chat found with ID:', chatId);
  }

  return chatId; // Return the chatId for further use (e.g., sending messages)
}

Fire.shared = new Fire();

export default Fire;