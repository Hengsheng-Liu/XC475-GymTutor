import { firestore } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

// Function to add a new user to Firestore
export async function addFeedback(
  userId: string,
  userName: string,
  feedbackType: string,
  feedbackText: string
):
  Promise<void> {

  const db = firestore;
  try {
    // Create new user
    await addDoc(collection(db, "Feedbacks"), {
      userId: userId,
      userName: userName,
      feedbackType: feedbackType,
      feedbackText: feedbackText
    });

    console.log("Document written to db");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};