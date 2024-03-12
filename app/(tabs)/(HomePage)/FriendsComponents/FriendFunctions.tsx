// Import necessary modules for Firestore operations
import { firestore } from '../../../../firebaseConfig';
import { 
    doc,
    updateDoc, 
    arrayUnion,
    arrayRemove } from 'firebase/firestore';
import {IUser} from "../../../../components/FirebaseUserFunctions"

// Function to check whether it should be able to add friends
export const canAddFriend = (User: IUser, Friend: IUser): boolean => {
    const userUID = User.uid;
    
    const isFriend = Friend.friends.includes(userUID);
    const hasSentRequest = Friend.friendRequests.includes(userUID);
    const hasRequest = User.friendRequests.includes(Friend.uid);
    const isRejected = Friend.rejectedRequests.includes(userUID);
    const isBlocked = Friend.blockedUsers.includes(userUID);

    return !isFriend && !hasSentRequest && !hasRequest && !isRejected && !isBlocked;
};

// Send friend Requests
export const handleSendFriendRequest = (User: IUser, friend: IUser) => {
    // Check if userUID is not in friendsList, friendRequests, rejectedList, and blockedList
    if (canAddFriend(User, friend)) {
        // If userUID is not in any of the lists, send a friend request
        sendFriendRequest(User.uid, friend.uid);
    }
    // addFriend(userUID, friendUID);
};

// Function to send friend request
export async function sendFriendRequest(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);
    const friendRef = doc(db, 'Users', friendUID);
    

    // Append user uid to the friend requested
    try {
        await updateDoc(friendRef, { friendRequests: arrayUnion(userUID) });
        console.log('Friend Request sent successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error sending Friend Request:', error);
    }
}

// Function to add friends
export async function addFriend(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);
    const friendRef = doc(db, 'Users', friendUID);

    // Append user's uid to each other in friends section
    try {
        await removeFriendRequest(userUID, friendUID);
        await updateDoc(userRef, { friends: arrayUnion(friendUID) });
        await updateDoc(friendRef, { friends: arrayUnion(userUID) });
        console.log('Friend added successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

// Function to remember rejected requests
export async function rejectRequest(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);

    // Append user uid to the rejected request list
    try {
        await removeFriendRequest(userUID, friendUID);
        await updateDoc(userRef, { rejectedRequests: arrayUnion(userUID) });
        console.log('Added User on friends rejection list: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding user on rejection list: ', error);
    }
}

// Function to remove friend request from user's friend requests list
export const removeFriendRequest = async (userId: string, friendUid: string) => {
    const userRef = doc(firestore, 'Users', userId);

    try {
        // Update the user document to remove the friend request
        await updateDoc(userRef, {
            friendRequests: arrayRemove(friendUid)
        });
        console.log('Friend request removed successfully');
    } catch (error) {
        console.error('Error removing friend request:', error);
        throw error;
    }
};
