import React from "react";
import { Modal, Flex, Row, Button, Avatar, Spacer, Box, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { IUser } from "../FirebaseUserFunctions";
import Tags from "./Tags";
import { router } from "expo-router";
import { sendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { useState } from "react";
import { useAuth } from "@/Context/AuthContext";

interface Props {
    users: IUser[];
    user: IUser;
    isOpen: boolean;
    onClose: () => void;
  }
  
  const UserExpandedPreview: React.FC<Props> = ({ users, user, isOpen, onClose }) => {
    const [selectedUser, setSelectedUser] = useState<IUser>(user); // State to hold updated friend data
    const {currUser, updateFriend } = useAuth();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    if (!currUser) return;

    // TODO: Display user preview when clicked
    const handleOpenProfile = async () =>{
        await updateFriend(selectedUser);
        console.log("HEY");
        router.push("/FriendProfile");

        // Open Profile
    };

    const handleNextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
        setSelectedUser(users[currentIndex]);
    };
    
      const handlePreviousUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1) % users.length);
        setSelectedUser(users[currentIndex]);
    };

    return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" >
      <Modal.Content backgroundColor="#FFF7ED">
        <Modal.CloseButton/>
        {selectedUser && (
          <Flex direction="column" alignItems="center" justifyContent="center" mt={5}>
          <Avatar
            mb={3}
            size="xl"
            source={selectedUser.icon ? { uri: selectedUser.icon } : require("@/assets/images/default-profile-pic.png")}
          />
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {selectedUser.name}, {selectedUser.age}
          </Text>
          {users.length > 1? (
          <Row alignItems="center" mr="2" ml="2" p="3" justifyContent={"space-between"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePreviousUser()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer/>
            <Text fontSize="md" m={3}>
                {selectedUser.bio}
            </Text>
            <Spacer/>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNextUser()}>
                <FontAwesome name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
            </Row> ) : (
            <Row alignItems="center" mr="2" ml="2" p="5" justifyContent={"space-between"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePreviousUser()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer/>
            <Text fontSize="md" m={3}>
                {selectedUser.bio}
            </Text>
            <Spacer/>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNextUser()}>
                <FontAwesome name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
            </Row>)}
          <Box overflow="hidden" mb={3}>
            <Flex flexDirection="row" justifyContent="space-evenly">
              {selectedUser.tags && selectedUser.tags.slice(0, 3).map((tag, index) => (
                <Tags key={index} title={tag} />
              ))}
            </Flex>
            <Flex flexDirection="row" justifyContent="space-evenly">
              {selectedUser.tags && selectedUser.tags.slice(3, 5).map((tag, index) => (
                <Tags key={index} title={tag} />
              ))}
            </Flex>
          </Box>
          <Flex direction="row" justifyContent="space-between" width="90%" m={3}>
            <Button onPress={() => handleOpenProfile()} size="lg" width="45%" backgroundColor="#0284C7">
              <Text fontSize="md" color="#FFF" fontWeight="bold">Profile</Text>
            </Button>
            <Button
              onPress={() => canAddFriend(currUser, selectedUser)? 
                    sendFriendRequest(currUser.uid, selectedUser.uid): console.log("Cannot add friend")}
              size="lg"
              width="45%"
              backgroundColor= {canAddFriend(currUser, selectedUser)? "#0284C7" : "gray.200"}
              //_pressed={{ backgroundColor: "#0369A1" }}
            >
                <Text fontSize="md" color="#FFF" fontWeight="bold"> {canAddFriend(currUser, selectedUser)? "  Add   " : "Added"}</Text>
            </Button>
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