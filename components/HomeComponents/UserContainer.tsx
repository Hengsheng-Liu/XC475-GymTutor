import React, {useState, useEffect} from 'react'
import { Flex, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { sendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

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
        // Do something when user is clicked
        // Open Profile
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
                <Avatar size= "xl" source={require("../../assets/images/bob.png")} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text color= "trueGray.900" fontSize="sm">{friend.email}</Text>
                    <Text color= "trueGray.900" fontSize="sm">{friend.gym}</Text>
                </Column>
                <Spacer/>
                {canAddFriend(currUser, updatedFriend) && (
                <Button m="1" backgroundColor= "blue.500" rounded="full" onPress={() => sendFriendRequest(currUser.uid, friend.uid)}>
                  <Text fontSize="lg" fontWeight="bold">+</Text>
                </Button>
                )}
            </Row>
        </Flex>
        </Pressable>
    );
  };

  export default UserPreview;