import React, {useState} from 'react'
import { Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { addFriend, rejectRequest } from '@/components/FriendsComponents/FriendFunctions'

interface FriendProps {
    friend: IUser;
}

const FriendRequest: React.FC<FriendProps> = ({ friend }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const {currUser} = useAuth();
    if (!currUser) return;

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        setIsPressed(true)
        console.log("Notification is pressed")
    };

    return (
        <Pressable 
            onPress = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            p = {3} mb ={3}
            borderRadius="xl" borderWidth={1} borderColor="trueGray.50" shadow="3"
            bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
            >
            <Row alignItems="center" justifyContent="left" space="sm">
                <Avatar size= "xl" source={friend.icon ? {uri: friend.icon} : require("@/assets/images/default-profile-pic.png")} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text/>
                </Column>
                <Spacer/>
                <Column>
                <Button m="1" backgroundColor= "green.500" onPress={() => addFriend(currUser.uid, friend.uid)}>
                    <Text color= "trueGray.900" fontSize="sm" fontWeight="bold">Accept</Text>
                </Button>
                <Button m="1" backgroundColor= "red.500" onPress={() => rejectRequest(currUser.uid, friend.uid)}>
                    <Text color= "trueGray.900" fontSize="sm" fontWeight="bold">Reject</Text>
                </Button>
                </Column>
            </Row>
        </Pressable>
    );
  };

  export default FriendRequest;