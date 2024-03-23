import React, { Component, useEffect, useState } from "react";
import { firestore, auth } from "../../../firebaseConfig";
import {
  limit,
  where,
  query,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  Query,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../../Context/AuthContext";
import {
  Box,
  Button,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Spacer,
  Tag,
  extendTheme,
  Flex,
} from "native-base";
import Header from "../../../components/ProfileComponents/Header";
import ButtonGroup from "../../../components/ProfileComponents/ButtonGroup";
import Description from "../../../components/ProfileComponents/Description";
import Achievement from "../../../components/ProfileComponents/Achievement";
import Attribute from "../../../components/ProfileComponents/Attribute";
import Calendar from "../../../components/ProfileComponents/Calendar";
import {
  getUser,
  IUser,
  getCurrUser,
} from "../../../components/FirebaseUserFunctions";
import { SafeAreaView } from "react-native";
// note - I originally wrote everything below in UserProfilePage.tsx under 'components', and tried importing
// it from there, but for some reason that didn't work. So for now, I put the code in UserProfilePage in this file

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<IUser>();
  const { User } = useAuth(); // gets current user's authentication data (in particular UID)
  const description: string[] = [
    "GymNewbie",
    "YogaLover",
    "CardioKing",
    "WeightLifter",
    "YogaLover",
    "CardioKing",
    "WeightLifter",
  ];

  // finds the current user's data (only name for now) via Users firestore database.

  useEffect(() => {
    if (!User) return;
    const fetchUser = async () => {
      const unsub = onSnapshot(doc(firestore, "Users", User.uid), (doc) => {
        setUserInfo(doc.data() as IUser);
        console.log("user info", userInfo)
      });
    };
    fetchUser();

  }, []);

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
      <SafeAreaView>
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Box ml={"3"} mr={"3"}>
            {userInfo && (
              <Flex>
                <Header name={userInfo.name} gym={userInfo.gym} />

                <Attribute description={description} />
                <ButtonGroup />
                <Description bio={userInfo.bio} />
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

export default ProfilePage;
