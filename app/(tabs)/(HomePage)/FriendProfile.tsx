import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../../Context/AuthContext";
import { Box, NativeBaseProvider, ScrollView, extendTheme, Flex } from "native-base";
import Header from "../../../components/FriendsComponents/Header";
import ButtonGroup from "../../../components/ProfileComponents/ButtonGroup";
import Description from "../../../components/ProfileComponents/Description";
import Achievement from "../../../components/ProfileComponents/Achievement";
import Attribute from "../../../components/ProfileComponents/Attribute";
import Calendar from "../../../components/ProfileComponents/Calendar";
import { IUser } from "../../../components/FirebaseUserFunctions";
import { SafeAreaView } from "react-native";
import { useRoute } from '@react-navigation/native';

import { router, useLocalSearchParams } from "expo-router";


const FriendProfilePage = () => {
  const { friend } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(friend);

  const updateBio = async (newBio:string) => {

  };

  const updateTags = async (addTag:string) => {
    
  };

  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          color: "#0369A1",
          rounded: "full",
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style= {{backgroundColor:"#FFF"}}>
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"}>
            {userInfo && (
              <Flex>
                <Header user={userInfo} />
                <Attribute description={userInfo.tags} onSaveTag={updateTags} />
                <ButtonGroup friendCount={userInfo.friends.length + " Friends"}/>
                <Description bio={userInfo.bio} onSave={updateBio}/>
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
