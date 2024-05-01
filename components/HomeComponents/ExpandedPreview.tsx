import React from "react";
import { Modal, Flex, Row, Icon, Badge, Button, Avatar, Spacer, Box, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { IUser } from "../FirebaseUserFunctions";
import Tags from "./Tags";
import { router } from "expo-router";
import { canAddFriend, canMessage } from "../FriendsComponents/FriendFunctions"
import { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import { SvgUri } from "react-native-svg";

import { firestore } from "@/firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { findOrCreateChat } from "@/app/(tabs)/(MessagePage)/data.js";
import { globalState } from '@/app/(tabs)/(MessagePage)/globalState';

import { getUserIcon } from "../FirebaseUserFunctions";

interface Props {
    users: IUser[];
    user: IUser;
    isOpen: boolean;
    onClose: () => void;
    updateFetchedUsers: (user: IUser) => void;
  }
  
  const UserExpandedPreview: React.FC<Props> = ({ users, user, isOpen, onClose, updateFetchedUsers }) => {
    const [selectedUser, setSelectedUser] = useState<IUser>(user); // State to hold updated friend data
    const {currUser, updateFriend, friend } = useAuth();
    const [currentIndex, setCurrentIndex] = useState<number>( users.findIndex(u => u.uid === user.uid));
    const [friendIcon, setFriendIcon] = useState<string>();

    if (!currUser) return;

    useEffect(() => {
      setSelectedUser(users[currentIndex]);
      const friend = users[currentIndex];
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
          console.log("Found Icon URL: ", url)
          setFriendIcon(url);
        }
      }
    
      if (currUser) {
          fetchIcon();
      }
    }, [currentIndex, users]);

  
    // Open the friend's profile
    const handleOpenProfile = async () =>{
        onClose();
        await updateFriend(selectedUser);
        router.push("/FriendProfile");

    };
    
    const openChat = async (friend: any) => {
        onClose();
        console.log(findOrCreateChat(currUser.uid, friend.uid));
        globalState.user = friend; // Set the selected user in the global state
        router.navigate("ChatPage"); // Then navigate to ChatPage
    };

    const handleNextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
    };
    
      const handlePreviousUser = () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = users.length - 1;
        }
        setCurrentIndex(prevIndex);
    };

    const handleSendFriendRequest = async (userUID: string, friendUID: string) => {
      const db = firestore;
      const friendRef = doc(db, 'Users', friendUID);
      const timestamp = new Date().getTime();

      try {
          if (selectedUser){    
              const updatedFriend = { ...selectedUser};
              updatedFriend.friendRequests.push({friend: userUID, date: timestamp, status: "pending"});
              updateFriend(updatedFriend);
              updateFetchedUsers(updatedFriend);
              console.log(updatedFriend);
          }
          await updateDoc(friendRef, { friendRequests: arrayUnion({friend: userUID, date: timestamp, status: "pending"}) });
          console.log('Friend Request sent successfully: ', friendUID, userUID);
      } catch (error) {
          console.error('Error sending Friend Request:', error);
      }
  }

    return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" width={"100%"} height={"100%"}>
      <Modal.Content backgroundColor="#F5F5F5">
        <Modal.CloseButton/>
        {selectedUser && (
          <Flex direction="column" alignItems="center" justifyContent="center" mt={5}>
          <Avatar
            mb={3}
            size="2xl"
            source={{ uri: friendIcon }}
          />
          <Text fontSize="xl" fontWeight="bold" isTruncated maxWidth="85%">
            {selectedUser.name}, {selectedUser.age}
          </Text>
          {/* <Text fontSize="sm" color="trueGray.500">{selectedUser.status}</Text> */}
          <Text color= "trueGray.900" fontSize="sm" height={20} numberOfLines={2} textAlign="center" isTruncated maxWidth="75%">
            {selectedUser.bio}
          </Text>
          <Row alignItems="center" mr="2" ml="2" mb={0} p="3" pt="2" pb="0" justifyContent={"space-between"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePreviousUser()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer/>
            <Badge m = {2} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {selectedUser.gymExperience.charAt(0).toUpperCase() + selectedUser.gymExperience.slice(1)}
            </Badge>
            <Spacer/>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNextUser()}>
                <FontAwesome name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </Row> 
          <Box overflow="hidden" mb={3} marginX={9}>
            <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly">
              {selectedUser.tags && selectedUser.tags.slice(0, 4).map((tag, index) => (
                <Badge m = {2} colorScheme={"muted"} shadow={1} borderRadius={4}>{tag}</Badge>
              ))}
            </Flex>
          </Box>
          <Flex direction="row" justifyContent="space-between" width="90%" m={3}>
            <Button onPress={() => handleOpenProfile()} size="lg" width="45%" backgroundColor="#FAFAFA" borderColor="#F97316" borderWidth={2} borderRadius={16}>
              <Text fontSize="md" color="#F97316" fontWeight="bold">View Profile</Text>
            </Button>
            { canAddFriend(currUser, selectedUser) ? (
              <Button
              onPress={() => handleSendFriendRequest(currUser.uid, selectedUser.uid)}
              size="lg"
              width="45%"
              backgroundColor= "#F97316"
              borderRadius={16}
            >
                <Row>
                  <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                  <Text fontSize="md" color="#FFF" fontWeight="bold"> Connect</Text>
                </Row>
            </Button>
            ) : (
              canMessage(currUser, selectedUser) ? ( 
                <Button
                  onPress={() => openChat(selectedUser)}
                  size="lg"
                  width="45%"
                  backgroundColor= "#F97316"
                  borderRadius={16}
                  >
                    <Row>
                      <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                      <Text fontSize="md" color="#FFF" fontWeight="bold"> Message</Text>
                    </Row>
                </Button>
                ) : (
                  <Button
                    size="lg"
                    width="45%"
                    backgroundColor= "#469DA5"
                    borderRadius={16}
                    >
                  <Row>
                      <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                      <Text fontSize="md" color="#FFF" fontWeight="bold"> Requested</Text>
                    </Row>
                </Button>
                )
            )}
          </Flex>
          <Box flexDirection="row" justifyContent="space-between" px={4} pb={4}>
        </Box>
        </Flex>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default UserExpandedPreview;