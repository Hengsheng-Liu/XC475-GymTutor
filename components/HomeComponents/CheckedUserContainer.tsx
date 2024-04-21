import React, {useState, useEffect} from 'react'
import { Flex, Image, Row, Box, Badge, Column, Text, Avatar} from 'native-base'
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

const CheckedUserPreview: React.FC<FriendProps> = ({ friend }) => {
    const [updatedFriend, setUpdatedFriend] = useState<IUser>(friend); // State to hold updated friend data
    const [friendIcon, setFriendIcon] = useState<string>(); 
    const [friendPicture, setFriendPicture] = useState<string>();
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

        async function fetchCheckInPicture() {
            const photo = friend.checkInHistory[friend.checkInHistory.length-1].photo;
            if (currUser && photo && photo !== "") {
              try {
                const url = await getUserIcon(photo);
                // console.log("Found Check In Picture: ", url);
                setFriendPicture(url);
              } catch (error) {
                console.error("Failed to fetch friend picture:", error);
                // Handle the error e.g., set a default icon or state
                const url = await getUserIcon("Icon/Default/Avatar.png");
                console.log("Used default Icon URL: ", url)
                setFriendPicture(url);
              }
            } else {
            const url = await getUserIcon("Icon/Default/Avatar.png");
            // console.log("Used default Icon URL: ", url)
            setFriendIcon(url);
          }
        }

        if (currUser) {
            fetchIcon();
            fetchUpdatedFriend();
            fetchCheckInPicture();
        }

    }, [currUser, friend.uid,friend.icon]); // Depend on currUser and friend.uid
      
    return (
        <Flex mt="1">
            <Row mr="1" ml="1" alignItems="center" justifyContent="center">
                <Image source={{ uri: friendPicture }} alt="Check In Picture" size="xl" height="180" resizeMode="cover" borderRadius="10" flex="1"/>
            </Row>
            <Row justifyContent="center">
                <Text color= "trueGray.900" fontSize="sm" numberOfLines={2} textAlign="center" isTruncated maxWidth="85%">
                    {friend.bio}
                </Text>
            </Row>
            {/*<Row justifyContent={"center"}>
                <Badge m="1" colorScheme={"blue"}>
                    <Text fontSize="xs">{friend.tags[0]}</Text>
                </Badge>
            </Row>*/}
            <Row alignItems="center" space="sm">
                <Avatar m={2} size="md" source={{ uri: friendIcon }} />
                <Column justifyContent={"space-evenly"}>
                <Row justifyContent= {"space-between"} >
                    <Column overflow="hidden">    
                        <Text color= "trueGray.900" fontSize="md" fontWeight="bold" isTruncated>{friend.name}, {friend.age}</Text>
                    </Column>
                </Row>
                </Column>
            </Row>
        </Flex>
    );
  };

  export default CheckedUserPreview;