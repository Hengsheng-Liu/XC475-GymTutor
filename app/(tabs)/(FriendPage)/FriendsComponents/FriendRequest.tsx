import React, {useState} from 'react'
import { Flex, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { addFriend, removeFriendRequest, rejectRequest } from '@/components/HandleFriends'

interface FriendProps {
    friend: IUser;
    index: number;
}

const FriendRequest: React.FC<FriendProps> = ({ friend, index }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const {currUser} = useAuth();
    if (!currUser) return;

    // Function to accept friend request
    const acceptFriendRequest = async (friend: IUser) => {
        // Add friend to the user's friend list
        await addFriend(currUser.uid, friend.uid);
        // Remove friend request from user's friend requests list
        await removeFriendRequest(currUser.uid, friend.uid);
        // Refetch friend requests
        // fetchRequests();
    };

    // Function to reject friend request
    const rejectFriendRequest = async (friend: IUser) => {
        // Remove friend request from user's friend requests list
        await removeFriendRequest(currUser.uid, friend.uid);

        await rejectRequest(currUser.uid, friend.uid);
        // Refetch friend requests
        // fetchRequests();
    };

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        setIsPressed(true)
        console.log("Notification is pressed")
        // Do something when user is clicked
        // Open Profile
    };
    return (
        <Pressable 
            onPressIn = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            p = {3} // This okay?
            borderBottomColor="trueGray.300" borderBottomWidth= "1" shadow="3"
            bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
            >
        <Flex            >
            <Row alignItems="center" justifyContent="left" space="sm">
                {/* Replace 'friend.icon' with the actual profile picture source */}
                <Avatar size= "xl" source={require("../bob.png")} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text/>
                </Column>
                <Spacer/>
                <Column>
                <Button m="1" backgroundColor= "red.500" onPress={() => acceptFriendRequest(friend)}>
                  <Text>Accept</Text>
                </Button>
                <Button m="1" backgroundColor= "green.500" onPress={() => rejectFriendRequest(friend)}>
                  <Text>Reject</Text>
                </Button>
                </Column>
            </Row>
        </Flex>
        </Pressable>
    );
  };

  export default FriendRequest;