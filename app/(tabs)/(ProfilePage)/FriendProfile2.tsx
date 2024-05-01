import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { Box, Popover, HStack, Row, Icon, Text, Button, NativeBaseProvider, ScrollView, Flex } from "native-base";
import Header from "../../../components/FriendsComponents/Header2";
import Description from "../../../components/FriendsComponents/Description";
import Achievement from "../../../components/FriendsComponents/Achievement";
import Attribute from "../../../components/FriendsComponents/Attribute";
import History from "../../../components/ProfileComponents/History";
import DropdownButton from "@/components/FriendsComponents/dropDownButton";
import { IUser } from "../../../components/FirebaseUserFunctions";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import theme from "@/components/theme";
import { canMessage, canAddFriend } from "@/components/FriendsComponents/FriendFunctions"
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore } from "@/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

import { SvgUri } from "react-native-svg";

import { findOrCreateChat } from "@/app/(tabs)/(MessagePage)/data.js";
import { globalState } from '@/app/(tabs)/(MessagePage)/globalState';

const FriendProfilePage = () => {
  const { friend, currUser, updateCurrUser, updateFriend } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(friend);

  useEffect(() => {
    if (!friend) return;
    const fetchUser = async () => {
      const unsub = onSnapshot(
        doc(firestore, "Users", friend.uid),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as IUser;
            setUserInfo(data);
          } else {
            console.log("No user data available");
          }
        }
      );
      return () => unsub();
    };

    fetchUser();
  }, [friend]);

  const openChat = async (friend: any) => {
    if (currUser) {
      console.log(findOrCreateChat(currUser.uid, friend.uid));
      globalState.user = friend; // Set the selected user in the global state
      router.navigate("ChatPage"); // Then navigate to ChatPage
    };
  };

  const handleSendFriendRequest = async (userUID: string, friendUID: string) => {
    const db = firestore;
    const friendRef = doc(db, 'Users', friendUID);
    const timestamp = new Date().getTime();

    try {
      if (userInfo) {
        const updatedFriend = { ...userInfo };
        updatedFriend.friendRequests.push({ friend: userUID, date: timestamp, status: "pending" });
        updateFriend(updatedFriend);
        console.log(updatedFriend);
      }
      await updateDoc(friendRef, { friendRequests: arrayUnion({ friend: userUID, date: timestamp, status: "pending" }) });
      console.log('Friend Request sent successfully: ', friendUID, userUID);
    } catch (error) {
      console.error('Error sending Friend Request:', error);
    }
  }

  const removeFriend = async (userUID: string, friendUID: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const friendRef = doc(firestore, 'Users', friendUID);

    if (currUser && friend && !canMessage(currUser, friend)) {
      console.log('Cannot remove friend');
      return;
    };

    try {
      if (currUser) {
        const updatedUser = { ...currUser };
        const friendIndex = updatedUser.friends.indexOf(friendUID);
        updatedUser.friends.splice(friendIndex, 1);
        const friendRequests = currUser.friendRequests;
        const updatedRequests = friendRequests.filter(request => {
            if (request.friend === friendUID) {
                return;
            } else {
                    return request;
            }});
        updatedUser.friendRequests = updatedRequests;
        updateCurrUser(updatedUser);
        // Remove friendUid from user's friends list
        updateDoc(userRef, { friends: arrayRemove(friendUID), friendRequests: updatedUser.friendRequests });
      }

      if (friend) {
        const updatedFriend = { ...friend };
        const userIndex = updatedFriend.friends.indexOf(userUID);
        updatedFriend.friends.splice(userIndex, 1);
        updateFriend(updatedFriend);
      }
      // Remove userId from friend's friends list
      updateDoc(friendRef, { friends: arrayRemove(userUID) });

      console.log('Friend removed successfully');
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  };

  const blockUser = async (userUID: string, userToBlockUID: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const userToBlockRef = doc(firestore, 'Users', userToBlockUID);

    try {
      if (currUser) { 
        const updatedUser = { ...currUser };
        const friendIndex = updatedUser.friends.indexOf(userToBlockUID);
        updatedUser.friends.splice(friendIndex, 1);
        const friendRequests = currUser.friendRequests;
        const updatedRequests = friendRequests.filter(request => {
            if (request.friend === userToBlockUID) {
                return;
            } else {
                    return request;
            }});
        updatedUser.friendRequests = updatedRequests;
        updateCurrUser(updatedUser);
        
        // Update current user's document
        await updateDoc(userRef, { friends: arrayRemove(userToBlockUID), blockedUsers: arrayUnion(userToBlockUID), friendRequests: updatedUser.friendRequests });
          } 
        if (friend) {
          const updatedFriend = { ...friend };
          const userIndex = updatedFriend.friends.indexOf(userUID);
          updatedFriend.friends.splice(userIndex, 1);
          updateFriend(updatedFriend);
        }
        // Update user to block's document
        updateDoc(userToBlockRef, { friends: arrayRemove(userUID), blockedUsers: arrayUnion(userUID),  });

        console.log('User blocked successfully');
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
  router.back();
};

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={{ backgroundColor: "#FFF" }}>
        <Row m={3}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <FontAwesome name="chevron-left" size={24} color="#F97316" />
          </TouchableOpacity>
        </Row>  
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Box>
            {userInfo && (
              <Flex>
                  <Header
                    name={userInfo.name}
                    gym={userInfo.gym}
                    icon={userInfo.icon}
                    background={userInfo.background}
                  />
                <Attribute description={userInfo.tags} />
                <HStack
                  space={3}
                  justifyContent={"space-around"}
                  mt={6} ml={"3"} mr={"3"}
                  textAlign={"center"}
                >
                  <Button width="40%" variant={"outline"} borderRadius={16} borderColor="#F97316" background= "#FFF" borderWidth="2" _pressed= {{}}>
                    <Text fontSize="md" color="#C2410C" > {userInfo.friends.length} {userInfo.friends.length == 1 ? " Friend" : "Friends"} </Text>
                  </Button>

                  {currUser && (canAddFriend(currUser, userInfo) ? (
                    <Button
                      onPress={() => handleSendFriendRequest(currUser.uid, userInfo.uid)}
                      size="lg"
                      width="40%"
                      shadow="2"
                      backgroundColor={"#F97316"}
                      _pressed={{ opacity: 0.5 }}
                      borderRadius={16}
                    >
                      <Row>
                        <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />} />
                        <Text fontSize="md" color="#FFF" fontWeight="bold"> Connect</Text>
                      </Row>
                    </Button>
                  ) : (
                    canMessage(currUser, userInfo) ? (
                      <Button
                        onPress={() => openChat(userInfo)}
                        size="lg"
                        width="40%"
                        shadow="2"
                        backgroundColor={"#F97316"}
                        _pressed={{ opacity: 0.5 }}
                        borderRadius={16}
                      >
                        <Row>
                          <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />} />
                          <Text fontSize="md" color="#FFF" fontWeight="bold"> Message</Text>
                        </Row>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        width="40%"
                        shadow="2"
                        backgroundColor="#469DA5"
                        borderRadius={16}
                      >
                        <Row>
                          <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />} />
                          <Text fontSize="md" color="#FFF" fontWeight="bold"> Requested</Text>
                        </Row>
                      </Button>
                    )
                  ))}
                  {currUser &&
                    <Popover
                      trigger={(triggerProps) => {
                        return (
                          <Button {...triggerProps} size="lg" backgroundColor={"#F97316"}
                            _pressed={{ opacity: 0.5 }} borderRadius={16} shadow="2">
                            <Text fontSize="md" fontWeight="bold" color="#FFF">More</Text>
                          </Button>
                        );
                      }}>
                      <Popover.Content m={1}>
                        <Popover.Arrow />
                        <Popover.Body p={2}>
                          <Box>
                            { canMessage(currUser, userInfo) &&
                            <Button backgroundColor="#E2E8F0" borderRadius={8} mb={1} onPress={() => removeFriend(currUser.uid, userInfo.uid)}>
                              <Text fontSize="xs">Unfollow</Text>
                            </Button>}
                            <Button backgroundColor="#E2E8F0" borderRadius={8} onPress={() => blockUser(currUser.uid, userInfo.uid)}>
                              <Text fontSize="xs">Block</Text>
                            </Button>
                          </Box>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>}
                </HStack>
                
                <Flex ml={"3"} mr={"3"} pb={6} mb={6}>
                  <Description bio={userInfo.bio} />
                  <Achievement display={userInfo.display} />
                  <History history={userInfo.checkInHistory} />
                </Flex>
              </Flex>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default FriendProfilePage;
