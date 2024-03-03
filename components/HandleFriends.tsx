// Import necessary modules for Firestore operations
import { firestore } from '../firebaseConfig';
import { 
    doc,
    updateDoc, 
    arrayUnion} from 'firebase/firestore';
import {IUser} from "./FirebaseDataService"


// Function to add friends
export async function addFriend(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);
    const friendRef = doc(db, 'Users', friendUID);

    // Append user's uid to each other in friends section
    try {
        await updateDoc(userRef, { friends: arrayUnion(friendUID) });
        await updateDoc(friendRef, { friends: arrayUnion(userUID) });
        console.log('Friend added successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

// Function to check whether it should be able to add friends
export const canAddFriend = (userUID: string, Friend: IUser): boolean => {
    const isFriend = Friend.friends.includes(userUID);
    const hasSentRequest = Friend.friendRequests.includes(userUID);
    const isRejected = Friend.rejectedRequests.includes(userUID);
    const isBlocked = Friend.blockedUsers.includes(userUID);

    return !isFriend && !hasSentRequest && !isRejected && !isBlocked;
};

// Function to send friend request
export async function sendFriendRequest(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const friendRef = doc(db, 'Users', friendUID);

    // Append user uid to the friend requested
    try {
        await updateDoc(friendRef, { friendRequests: arrayUnion(userUID) });
        console.log('Friend Request sent successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error sending Friend Request:', error);
    }
}