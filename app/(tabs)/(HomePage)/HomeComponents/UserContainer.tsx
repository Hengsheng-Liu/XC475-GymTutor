import React, {useState, useEffect} from 'react'
import { Flex, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { handleSendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"

interface FriendProps {
    friend: IUser;
}

const UserPreview: React.FC<FriendProps> = ({ friend }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);
    const {currUser} = useAuth();
    if (!currUser) return;

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        setIsPressed(true)
        console.log("User is pressed")
        // Do something when user is clicked
        // Open Profile
    };

    // Send friend Requests
    const handleSendRequest = (userUID: string, friend: IUser) => {
        handleSendFriendRequest(userUID, friend);
        setFriendRequestSent(true);
        // handleGetUsers();
    };

    useEffect(() => {
        // Check if a friend request has already been sent
        const checkFriendRequestStatus = async () => {
            const isRequestSent = await hasFriendRequestSent();
            console.log(isRequestSent);
            setFriendRequestSent(isRequestSent);
        };
        if (currUser && friend) {
            checkFriendRequestStatus();
        }
    }, [currUser, friend]);

    // Function to check if a friend request has been sent
    const hasFriendRequestSent = async (): Promise<boolean> => {
        // Implement logic to check if a friend request has been sent from userUID to friendUID
        // Return true if a request has been sent, otherwise return false
        return friend.uid in currUser.friendRequests
    };

    return (
        <Pressable 
            onPress = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            p = {3} mb ={3} ml={1} mr={1} // This okay?
            borderRadius="xl" borderWidth={1} borderColor="trueGray.50" shadow="3"
            bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
            >
        <Flex>
            <Row alignItems="center" justifyContent="left" space="sm">
                {/* Replace 'friend.icon' with the actual profile picture source */}
                <Avatar size= "xl" source={require("../bob.png")} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text color= "trueGray.900" fontSize="sm">{friend.email}</Text>
                    <Text color= "trueGray.900" fontSize="sm">{friend.gym}</Text>
                </Column>
                <Spacer/>
                {canAddFriend(currUser.uid, friend) && (
                <Button m="1" backgroundColor= "blue.500" rounded="full" onPress={() => handleSendRequest(currUser.uid, friend)}>
                  <Text fontSize="md" fontWeight="bold">+</Text>
                </Button>
                )}
            </Row>
        </Flex>
        </Pressable>
    );
  };

  export default UserPreview;