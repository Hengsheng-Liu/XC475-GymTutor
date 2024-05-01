import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Column,
  IconButton,
  Image,
  Center,
} from "native-base";
import { useAuth } from "@/Context/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Camera } from "expo-camera";
import { getUserPicture } from "@/components/FirebaseUserFunctions";
import { ImageBackground, StyleSheet } from "react-native";

interface HeaderProps {
  name: string;
  icon: string;
  gym: string;
  background: string;
}

export default function Header({ name, icon, gym, background }: HeaderProps) {
  const { currUser } = useAuth();
  const [userIcon, setUserIcon] = useState<string>(
    require("@/assets/images/default-profile-pic.png")
  );
  const [backgroundUrl, setBackgroundUrl] = useState<string>(
    require("@/assets/images/Background.jpeg")
  );

  useEffect(() => {
    async function fetchPicture() {
      if (currUser && icon !== "") {
        try {
          const Avatar = await getUserPicture(icon, "Avatar");
          const backgroundImg = await getUserPicture(background, "Background");
          if (Avatar){
          setUserIcon(Avatar);
          }
          if (backgroundImg){
          setBackgroundUrl(backgroundImg);
          }
        } catch (error) {
          console.error("Failed to fetch user icon:", error);
        }
      }
    }

    // Call the fetch function
    fetchPicture();
    console.log("Icon: ", userIcon);
  }, [icon, currUser]);

  if (!currUser) return null;

  return (
    <Flex>
      <Flex marginBottom={2}>
        <ImageBackground
          source={{ uri: backgroundUrl }}
          style={styles.image}
        >
          <Flex alignItems={"center"}
          marginTop={"1/3"}
          >
            <Image
              size={115}
              borderRadius={100}
              source={{ uri: userIcon }}
              alt="User Icon"
            />
          </Flex>
        </ImageBackground>
        <Flex alignItems={"center"} mt={2} mb={0}>
          <Heading size="lg" color="black">{name}</Heading>
          <Text mt={1} isTruncated maxW="4/5" >
            {gym}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: 200,
    marginBottom: 25
  },
});
