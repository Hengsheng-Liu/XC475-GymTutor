import React, { useState, useEffect } from 'react'
import { Spacer, Button, Row, Column, Pressable, Text, Avatar, Box} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { router } from 'expo-router';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { globalState } from '@/app/(tabs)/(MessagePage)/globalState';
import { findOrCreateChat } from '@/app/(tabs)/(MessagePage)/data';
import { getUserIcon } from '@/components/FirebaseUserFunctions';

interface FriendProps {
    friend: IUser;
    status: string;
}

const FriendRequest: React.FC<FriendProps> = ({ friend, status }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const {currUser, updateCurrUser, updateFriend, } = useAuth();
    const [friendIcon, setFriendIcon] = useState<string>(); 

    useEffect(() => {
        async function fetchIcon() {
            if (currUser && friend.icon !== "") {
              try {
                const url = await getUserIcon(friend.icon);
                // console.log("Found Icon URL: ", url);
                setFriendIcon(url);
              } catch (error) {
                console.error("Failed to fetch friend icon:", error);
                // Handle the error e.g., set a default icon or state
                const url = await getUserIcon("Icon/Default/Avatar.png");
                console.log("Used default Icon URL: ", url)
                setFriendIcon(url);
              }
            } else {
            const url = await getUserIcon("Icon/Default/Avatar.png");
            // console.log("Used default Icon URL: ", url)
            setFriendIcon(url);
          }
        }

        if (currUser) {
            fetchIcon();
        }
    }, [currUser, friend.uid,friend.icon]); // Depend on currUser and friend.uid
    
    if (!currUser) return;

    // Display user profile when user clicks on notification
    const handleUserClick  = () =>{
        updateFriend(friend);
        router.push("/FriendProfile");
    };

    // Function to add friends
    async function addFriend(userUID: string, friendUID: string): Promise<void> {
        const db = firestore;
        const userRef = doc(db, 'Users', userUID);
        const friendRef = doc(db, 'Users', friendUID);

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
            await updateFriendRequest(userUID, friendUID, "accepted");
            updateDoc(userRef, { friends: arrayUnion(friendUID) });
            updateDoc(friendRef, { friends: arrayUnion(userUID) });
            console.log('Friend added successfully: ', friendUID, userUID);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    }

// Function to remember rejected requests
    async function rejectRequest(userUID: string, friendUID: string): Promise<void> {
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
                updateDoc(userRef, { rejectedRequests: arrayUnion(friendUID) });
            }
            console.log('Added User on friends rejection list: ', friendUID, userUID);
        } catch (error) {
            console.error('Error adding user on rejection list: ', error);
        }
    }

    const updateFriendRequest = async (userUID: string, friendUID: string, status: string) => {
        const userRef = doc(firestore, 'Users', userUID);
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
                await updateDoc(userRef, { friendRequests: updatedFriendRequests});
            }
            console.log('Friend request updated successfully');
        } catch (error) {
            console.error('Error updating friend request:', error);
            throw error;
        }
    }

    const openChat = async (friend: any) => {
        console.log(findOrCreateChat(currUser.uid, friend.uid));
        globalState.user = friend; // Set the selected user in the global state
        router.navigate("/ChatPage"); // Then navigate to ChatPage
    };

    return (
        <Pressable onPress={() => handleUserClick()}> 
          {({ isPressed }) => {
              return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"} 
                          style={{transform: [{ scale: isPressed ? 0.96 : 1 }]}} 
                          shadow="3" borderRadius="xl" mb ={1} p={3}>
            <Row alignItems="center" justifyContent="left" space="sm">
                <Avatar size= "lg" source={{ uri: friendIcon }} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text/>
                </Column>
                <Spacer/>
                { status === "pending" ? (
                    <Row>
                        <Button m="1" backgroundColor= "trueGray.50"  height={8} pt={0} pb={0} alignItems="center" onPress={() => rejectRequest(currUser.uid, friend.uid)} >
                            <Text color= "trueGray.500"  fontSize="sm">Reject</Text>
                        </Button>
                        <Button m="1" backgroundColor= "#22C55E" height={8} pt={0} pb={0} onPress={() => addFriend(currUser.uid, friend.uid)}>
                            <Text color= "#FFF" fontSize="sm" fontWeight="bold">Accept</Text>
                        </Button>
                    </Row>
                ) : status === "accepted" ? (
                    <Row>
                        <Button m="1" backgroundColor= "trueGray.50"  height={8} pt={0} pb={0} alignItems="center" onPress={() => openChat(friend)} >
                            <Text color= "trueGray.500"  fontSize="sm">Chat</Text>
                        </Button>
                        <Button m="1" backgroundColor= "#166534" height={8} pt={0} pb={0} alignItems="center">
                            <Text color= "#FFF" fontSize="sm" fontWeight="bold">Accepted</Text>
                        </Button>
                    </Row>
                ) : (
                    <Row>
                        <Button m="1" backgroundColor= "#525252" height={8} pt={0} pb={0} alignItems="center" >
                            <Text color= "#FFF" fontSize="sm" fontWeight="bold">Rejected</Text>
                        </Button>
                    </Row>
                )}
            </Row>
            </Box>}}
        </Pressable>
    );
  };

  export default FriendRequest;