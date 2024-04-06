// Import necessary modules for Firestore operations
import { firestore } from '../../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import {IUser} from "../FirebaseUserFunctions"
import { useAuth } from '@/Context/AuthContext';

// Function to check whether it should be able to add friends
export const canAddFriend = (User: IUser, Friend: IUser): boolean => {
    const userUID = User.uid;
    
    const isFriend = Friend.friends.includes(userUID);
    const hasSentRequest = Friend.friendRequests.findIndex(request => request.friend === userUID) !== -1;
    const hasRequest = User.friendRequests.findIndex(request => request.friend === Friend.uid) !== -1;
    const isRejected = Friend.rejectedRequests.includes(userUID);
    const isBlocked = Friend.blockedUsers.includes(userUID);

    return !isFriend && !hasSentRequest && !hasRequest && !isRejected && !isBlocked;
};

// Function to check whether if they can message each other (checks if they are friends)
export const canMessage = (User: IUser, Friend: IUser): boolean => {
    const userUID = User.uid;
    
    const isFriend = Friend.friends.includes(userUID);
    const isMutualFriend = User.friends.includes(Friend.uid);
    const isBlocked = Friend.blockedUsers.includes(userUID);

    return isFriend && isMutualFriend && !isBlocked;
};

// Send friend Requests
export async function handleSendFriendRequest(User: IUser, friend: IUser): Promise<void> {
    // Check if userUID is not in friendsList, friendRequests, rejectedList, and blockedList
    if (canAddFriend(User, friend)) {
        // If userUID is not in any of the lists, send a friend request
        await sendFriendRequest(User.uid, friend.uid);
    }
    // addFriend(userUID, friendUID);
};

// Function to send friend request
export async function sendFriendRequest(userUID: string, friendUID: string): Promise<void> {
    const {updateFriend, friend} = useAuth();
    const db = firestore;
    const friendRef = doc(db, 'Users', friendUID);
    const timestamp = new Date().getTime();

    // Append user uid to the friend requested
    try {
        if (friend){    
            const updatedFriend = { ...friend };
            updatedFriend.friendRequests.push({friend: userUID, date: timestamp, status: "pending"});
            updateFriend(updatedFriend);
        }
        console.log("HEY :)")
        await updateDoc(friendRef, { friendRequests: arrayUnion({friend: userUID, date: timestamp, status: "pending"}) });
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
    const {currUser, updateCurrUser, friend, updateFriend, } = useAuth();

    // Append user's uid to each other in friends section
    try {
        if (currUser){    
            const updatedUser = { ...currUser };
            updatedUser.friends.push(friendUID);
            updateCurrUser(updatedUser);
        }
        if (friend){    
            const updatedFriend = { ...friend };
            updatedFriend.friends.push(userUID);
            updateFriend(updatedFriend);
        }
        // removeFriendRequest(userUID, friendUID);
        updateFriendRequest(userUID, friendUID, "accepted");
        updateDoc(userRef, { friends: arrayUnion(friendUID) });
        updateDoc(friendRef, { friends: arrayUnion(userUID) });
        console.log('Friend added successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

// Function to remember rejected requests
export async function rejectRequest(userUID: string, friendUID: string): Promise<void> {
    const {currUser, updateCurrUser} = useAuth();
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);

    // Append user uid to the rejected request list
    try {  
        // removeFriendRequest(userUID, friendUID);
        updateFriendRequest(userUID, friendUID, "rejected");

        if (currUser){    
            const updatedUser = { ...currUser };
            updatedUser.rejectedRequests.push(friendUID);
            updateCurrUser(updatedUser);
        }
        updateDoc(userRef, { rejectedRequests: arrayUnion(userUID) });
        console.log('Added User on friends rejection list: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding user on rejection list: ', error);
    }
}

// Function to remove friend request from user's friend requests list
export const removeFriendRequest = async (userUID: string, friendUID: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const {currUser, updateCurrUser} = useAuth();
    try {
        if (currUser){    
            const updatedUser = { ...currUser };
            const friendIndex = updatedUser.friendRequests.findIndex(request => request.friend === friendUID);
            if (friendIndex !== -1) {
                updatedUser.friendRequests.splice(friendIndex, 1);
                updateCurrUser(updatedUser);

                // Update the user document to remove the friend request
                updateDoc(userRef, { friendRequests: arrayRemove(friendUID)});
            } else {
                console.log(`Friend request with friendUID ${friendUID} not found`);
            }
        }
        console.log('Friend request removed successfully');
    } catch (error) {
        console.error('Error removing friend request:', error);
        throw error;
    }
};

export const updateFriendRequest = async (userUID: string, friendUID: string, status: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const {currUser, updateCurrUser} = useAuth();
    try {
        if (currUser){    
            const updatedUser = { ...currUser };
            const updatedFriendRequests = updatedUser.friendRequests.map(request => {
                if (request.friend === friendUID) {
                    return { ...request, status, date: new Date().getTime() };
                }
                return request;
            });
            updatedUser.friendRequests = updatedFriendRequests;
            updateCurrUser(updatedUser);

            // Update the user document to remove the friend request
            updateDoc(userRef, { friendRequests: updatedFriendRequests});
        }
        console.log('Friend request updated successfully');
    } catch (error) {
        console.error('Error updating friend request:', error);
        throw error;
    }
}

// Function to remove a friend
export const removeFriend = async (userUID: string, friendUID: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const friendRef = doc(firestore, 'Users', friendUID);

    const {currUser, updateCurrUser, friend, updateFriend} = useAuth();

    try {
        if (currUser){    
            const updatedUser = { ...currUser };
            const friendIndex = updatedUser.friends.indexOf(friendUID);
            updatedUser.friends.splice(friendIndex, 1);
            updateCurrUser(updatedUser);
        }
        // Remove friendUid from user's friends list
        updateDoc(userRef, { friends: arrayRemove(friendUID)});

        if (friend){
            const updatedFriend = { ...friend };
            const userIndex = updatedFriend.friends.indexOf(userUID);
            updatedFriend.friends.splice(userIndex, 1);
            updateFriend(updatedFriend);
        }
        // Remove userId from friend's friends list
        updateDoc(friendRef, { friends: arrayRemove(userUID)});

        console.log('Friend removed successfully');
    } catch (error) {
        console.error('Error removing friend:', error);
        throw error;
    }
};
