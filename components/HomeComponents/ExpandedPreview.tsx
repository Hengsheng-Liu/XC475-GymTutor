import React from "react";
import { Modal, Flex, Row, Icon, Badge, Button, Avatar, Spacer, Box, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { IUser } from "../FirebaseUserFunctions";
import Tags from "./Tags";
import { router } from "expo-router";
import { sendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import { SvgUri } from "react-native-svg";


import { findOrCreateChat } from "@/app/(tabs)/(MessagePage)/data.js";
import { globalState } from '@/app/(tabs)/(MessagePage)/globalState';

interface Props {
    users: IUser[];
    user: IUser;
    isOpen: boolean;
    onClose: () => void;
  }
  
  const UserExpandedPreview: React.FC<Props> = ({ users, user, isOpen, onClose }) => {
    const [selectedUser, setSelectedUser] = useState<IUser>(user); // State to hold updated friend data
    const {currUser, updateFriend } = useAuth();
    const [currentIndex, setCurrentIndex] = useState<number>( users.findIndex(u => u.uid === user.uid));

    if (!currUser) return;

    useEffect(() => {
      setSelectedUser(users[currentIndex]);
    }, [currentIndex, users]);
  
    // Open the friend's profile
    const handleOpenProfile = async () =>{
        await updateFriend(selectedUser);
        router.push("/FriendProfile");

    };
    
    const openChat = async (friend: any) => {
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

    return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" >
      <Modal.Content backgroundColor="#F5F5F5">
        <Modal.CloseButton/>
        {selectedUser && (
          <Flex direction="column" alignItems="center" justifyContent="center" mt={5}>
          <Avatar
            mb={3}
            size="2xl"
            source={selectedUser.icon ? { uri: selectedUser.icon } : require("@/assets/images/default-profile-pic.png")}
          />
          <Text fontSize="xl" fontWeight="bold">
            {selectedUser.name}, {selectedUser.age}
          </Text>
          <Text fontSize="sm" color="trueGray.500">{selectedUser.status}</Text>
          <Row alignItems="center" mr="2" ml="2" p="3" justifyContent={"space-between"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePreviousUser()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer/>
            <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {selectedUser.gymExperience.charAt(0).toUpperCase() + selectedUser.gymExperience.slice(1)}
            </Badge>
            <Spacer/>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNextUser()}>
                <FontAwesome name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
            </Row> 
          <Box overflow="hidden" mb={3}>
            <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly">
              {selectedUser.tags && selectedUser.tags.slice(0, 5).map((tag, index) => (
                <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>{tag}</Badge>
              ))}
            </Flex>
          </Box>
          <Flex direction="row" justifyContent="space-between" width="90%" m={3}>
            <Button onPress={() => handleOpenProfile()} size="lg" width="45%" backgroundColor="#FAFAFA" borderColor="#0284C7" borderWidth={2} borderRadius={16}>
              <Text fontSize="md" color="#0284C7" fontWeight="bold">View Profile</Text>
            </Button>
            { canAddFriend(currUser, selectedUser) ? (
              <Button
              onPress={() => sendFriendRequest(currUser.uid, selectedUser.uid)}
              size="lg"
              width="45%"
              backgroundColor= "#0284C7"
              borderRadius={16}
            >
                <Row>
                  <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                  <Text fontSize="md" color="#FFF" fontWeight="bold"> Connect</Text>
                </Row>
            </Button>
            ) : (
              <Button
              onPress={() => openChat(selectedUser)}
              size="lg"
              width="45%"
              backgroundColor= "#0284C7"
              borderRadius={16}
            >
                <Row>
                  <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                  <Text fontSize="md" color="#FFF" fontWeight="bold"> Message</Text>
                </Row>
            </Button>

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