import React, {useState, useEffect} from 'react'
import { Flex, Box, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { sendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

import Attribute from "@/components/HomeComponents/Attribute"
interface FriendProps {
    friend: IUser;
}

const UserPreview: React.FC<FriendProps> = ({ friend }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [updatedFriend, setUpdatedFriend] = useState<IUser>(friend); // State to hold updated friend data
    const {currUser} = useAuth();
    if (!currUser) return;

    useEffect(() => {
        const fetchUpdatedFriend = async () => {
            const userDocRef = doc(firestore, 'Users', friend.uid);
            const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
                const updatedUserData = snapshot.data() as IUser | undefined;
                if (updatedUserData) {
                    setUpdatedFriend(updatedUserData);
                }
            });
            return unsubscribe; // Cleanup function
        };

        if (currUser) {
            fetchUpdatedFriend();
        }
    }, [currUser, friend.uid]); // Depend on currUser and friend.uid

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        setIsPressed(true)
        console.log("User is pressed")
        console.log(friend.tags);
        // Do something when user is clicked
        // Open Profile
    };
      
    return (
        <Pressable 
            onPress = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            mb ={3} ml={1} mr={1} // This okay?
            borderRadius="xl" borderWidth={1} borderColor="trueGray.50" shadow="3"
            bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
            >
        <Box>
            <Row alignItems="center" space="sm">
                <Avatar m={2} size= "xl" source={friend.icon ? {uri: friend.icon} : require("@/assets/images/default-profile-pic.png")} />
                <Column>
                <Row justifyContent= {"space-between"} >
                    <Column overflow="hidden" width="170">    
                        <Text color= "trueGray.900" fontSize="md" fontWeight="bold" isTruncated maxW="160">{friend.name}</Text>
                        <Text color= "trueGray.900" fontSize="sm" isTruncated maxW="160">{friend.gym}</Text>
                    </Column>
                    <Spacer/>
                    <Box alignItems="center" w={20} h={10}>
                        <Button 
                            flex="auto"
                            backgroundColor= {canAddFriend(currUser, updatedFriend)? "blue.500" : "gray.200"} rounded="md" 
                            onPress={() => canAddFriend(currUser, updatedFriend)? 
                                sendFriendRequest(currUser.uid, friend.uid): handleUserClick()}>
                            <Text fontSize="xs" fontWeight="bold"> {canAddFriend(currUser, updatedFriend)? "  Add   " : "Added"}</Text>
                        </Button>
                    </Box>  
                </Row>
                <Attribute description={friend.tags} />
                </Column>
            </Row>
        </Box>
        </Pressable>
    );
  };

  export default UserPreview;