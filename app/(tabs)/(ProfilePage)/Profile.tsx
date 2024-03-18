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
} from "native-base";
import Header from "../../../components/ProfileComponents/Header";
import ButtonGroup from "../../../components/ProfileComponents/ButtonGroup";
import Description from "../../../components/ProfileComponents/Description";
import Achievement from "../../../components/ProfileComponents/Achievement";
import Attribute from "../../../components/ProfileComponents/Attribute";
import Calendar from "../../../components/ProfileComponents/Calendar";
// note - I originally wrote everything below in UserProfilePage.tsx under 'components', and tried importing
// it from there, but for some reason that didn't work. So for now, I put the code in UserProfilePage in this file

const ProfilePage = () => {
  const [userBio, setUserBio] = useState<string>("");
  const [userGender, setUserGender] = useState<string>("");
  const [userName, setUserName] = useState<string>(""); // state that finds the current user's name
  const { User } = useAuth(); // gets current user's authentication data (in particular UID)
  const description:string[]= [
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
    if (User?.uid) {
      //const email = user.email;
      //console.log("email", email);
      //console.log("uid", user.uid );

      // Finds the UID of the current user in 'Users' firestore database

      const docRef = doc(firestore, "Users", User.uid);

      const getDocument = async () => {

        const docSnap = await getDoc(docRef);

        if (docSnap && docSnap.exists()) {
          const name = await docSnap.get("name");
          const bio = await docSnap.get("bio");
          //      const age = await docSnap.get("age");
          const gender = await docSnap.get("sex");

          // assigns name to variable userName
          setUserName(name);
          setUserBio(bio);
          setUserGender(gender);
        } else {
          console.log("docSnap doesnt exist");
        }
      };

      getDocument();
    }
  }, [User]);

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
      <ScrollView backgroundColor={"#FFFFFF"}>
        <Box ml={"3"} mr={"3"}>
          <Header />
          <Attribute description = {description} />
          <ButtonGroup />
          <Description />
          <Achievement/>
          <Calendar />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ProfilePage;
