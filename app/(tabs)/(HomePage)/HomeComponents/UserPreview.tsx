import React, {useState} from 'react'
import { Flex, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { handleSendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"

interface FriendProps {
    friend: IUser;
}

const UserPreview: React.FC<FriendProps> = ({ friend }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
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
        // handleGetUsers();
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