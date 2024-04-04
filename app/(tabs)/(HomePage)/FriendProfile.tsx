import React, { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { Box, HStack, Row, Icon, Text, Button, NativeBaseProvider, ScrollView, Flex } from "native-base";
import Header from "../../../components/FriendsComponents/Header";
import Description from "../../../components/FriendsComponents/Description";
import Achievement from "../../../components/FriendsComponents/Achievement";
import Attribute from "../../../components/FriendsComponents/Attribute";
import Calendar from "../../../components/ProfileComponents/Calendar";
import DropdownButton from "@/components/FriendsComponents/dropDownButton";
import { IUser } from "../../../components/FirebaseUserFunctions";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import theme from "@/components/theme";
import { sendFriendRequest, canAddFriend } from "@/components/FriendsComponents/FriendFunctions"

import { SvgUri } from "react-native-svg";

import { findOrCreateChat } from "@/app/(tabs)/(MessagePage)/data.js";
import { globalState } from '@/app/(tabs)/(MessagePage)/globalState';

const FriendProfilePage = () => {
  const { friend, currUser } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(friend);

  const openChat = async (friend: any) => {
    if (currUser) {  
      console.log(findOrCreateChat(currUser.uid, friend.uid));
      globalState.user = friend; // Set the selected user in the global state
      router.navigate("ChatPage"); // Then navigate to ChatPage
    };
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style= {{backgroundColor:"#FFF"}}>
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"}>
            {userInfo && (
              <Flex>
                <Header user={userInfo} />
                <Attribute description={userInfo.tags} />
                <HStack
                  space={3}
                  justifyContent={"space-around"}
                  mt={6}
                  textAlign={"center"}
                >
                  <Button width="40%" variant={"outline"} borderRadius={16} onPress={() => router.push("/Friends")}>
                  <Text fontSize="md" color="#0284C7" > {userInfo.friends.length} {userInfo.friends.length == 1? " Friend" : "Friends"} </Text>
                  </Button>

                  { currUser && canAddFriend(currUser, userInfo) ? (
                    <Button
                    onPress={() => sendFriendRequest(currUser.uid, userInfo.uid)}
                    backgroundColor= "#0284C7"
                    borderRadius={16}
                    width="40%"
                  >
                      <Row>
                        <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                        <Text fontSize="md" color="#FFF" fontWeight="bold"> Connect</Text>
                      </Row>
                  </Button>
                  ) : (
                    <Button
                    onPress={() => openChat(userInfo)}
                    backgroundColor= "#0284C7"
                    borderRadius={16}
                    width="40%"
                  >
                      <Row>
                        <Icon as={<SvgUri uri={`/assets/images/Spot!.svg`} />}/>
                        <Text fontSize="md" color="#FFF" fontWeight="bold"> Message</Text>
                      </Row>
                  </Button>

                  )}
                  {currUser && <DropdownButton currUserUID={currUser.uid} friendUID={userInfo.uid}/>}
                </HStack>

                <Description bio={userInfo.bio}/>
                <Achievement />
                <Calendar />
              </Flex>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default FriendProfilePage;
