import React, {useState, useEffect} from 'react'
import { Flex, Box, Spacer, Button, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { sendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { getUserIcon } from '@/components/FirebaseUserFunctions';
import Attribute from "@/components/HomeComponents/Attribute"
interface FriendProps {
    friend: IUser;
}

const UserPreview: React.FC<FriendProps> = ({ friend }) => {
    const [updatedFriend, setUpdatedFriend] = useState<IUser>(friend); // State to hold updated friend data
    const [friendIcon, setFriendIcon] = useState<string>(); 
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

        async function fetchIcon() {
            if (currUser && friend.icon !== "") {
              try {
                const url = await getUserIcon(friend.icon);
                console.log("Found Icon URL: ", url);
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
            console.log("Found Icon URL: ", url)
            setFriendIcon(url);
          }
        }

        if (currUser) {
            fetchIcon();
            fetchUpdatedFriend();
        }
    }, [currUser, friend.uid,friend.icon]); // Depend on currUser and friend.uid

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        console.log("User is pressed")
        console.log(friend.tags);
        // Do something when user is clicked
        // Open Profile
    };
      
    return (
        <Flex>
            <Row alignItems="center" space="sm">
                <Avatar m={2} size="xl" source={{ uri: friendIcon }} />
                <Column justifyContent={"space-evenly"}>
                <Row justifyContent= {"space-between"} >
                    <Column overflow="hidden">    
                        <Text color= "trueGray.900" fontSize="md" fontWeight="bold" isTruncated>{friend.name}, {friend.age}</Text>
                        <Text color= "trueGray.900" fontSize="sm" isTruncated>{friend.status}</Text>
                    </Column>
                </Row>
                <Row justifyContent={"left"}>
                    <Attribute description={friend.tags} />
                </Row>
                </Column>
            </Row>
        </Flex>
    );
  };

  export default UserPreview;