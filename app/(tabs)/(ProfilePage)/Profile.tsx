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
import { Box, Button, NativeBaseProvider, Pressable, Spacer, Tag,extendTheme} from "native-base";
import Header from "./ProfileComponents/Header";
import Tags from "./ProfileComponents/Tags";
import { Flex } from "native-base";
import ButtonGroup from "./ProfileComponents/ButtonGroup";
// note - I originally wrote everything below in UserProfilePage.tsx under 'components', and tried importing
// it from there, but for some reason that didn't work. So for now, I put the code in UserProfilePage in this file

const ProfilePage = () => {
  const [userBio, setUserBio] = useState<string>("");
  const [userGender, setUserGender] = useState<string>("");
  const [userName, setUserName] = useState<string>(""); // state that finds the current user's name
  const { User } = useAuth(); // gets current user's authentication data (in particular UID)
  const description = ["GymNewbie", "YogaLover", "CardioKing", "WeightLifter","GymNewbie", "YogaLover", "CardioKing", "WeightLifter"]
  console.log("user", User);

  // finds the current user's data (only name for now) via Users firestore database.

  useEffect(() => {
    if (User?.uid) {
      //const email = user.email;
      //console.log("email", email);
      //console.log("uid", user.uid );

      // Finds the UID of the current user in 'Users' firestore database

      const docRef = doc(firestore, "Users", User.uid);
      console.log("uid", User.uid);

      const getDocument = async () => {
        console.log("docRef", docRef);

        const docSnap = await getDoc(docRef);

        if (docSnap && docSnap.exists()) {
          console.log("docSnap", docSnap.data());
          const name = await docSnap.get("name");
          const bio = await docSnap.get("bio");
          //      const age = await docSnap.get("age");
          const gender = await docSnap.get("sex");
          console.log(name, bio, gender);

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
    components:{
    Button:{
        baseStyle:{
            color: "#0369A1",
            rounded: "full",
        }
    }
    }
});

  return (
    <NativeBaseProvider theme={theme}>
      <Box backgroundColor={"#FFFFFF"} >
        <Header/>
        <Flex flexDirection ="row" wrap="wrap" justifyContent={"space-evenly"} mt = {3}>
            {description.map((str, index) =>
            <Tags key = {index} title={str}/>
            )}
            <Pressable onPress={() => (console.log("add"))} >
             <Tags title = {"+"}/>
            </Pressable>
        </Flex>
        <ButtonGroup/>
       
      </Box>
    </NativeBaseProvider>
  );
};

export default ProfilePage;
