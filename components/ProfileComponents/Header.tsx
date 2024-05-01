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

  const ReTakeAvatar = async () => {
    /*
    Camera.getCameraPermissionsAsync()
      .then((perm) => {
        if (perm.granted) {
          router.push({ pathname: "/Photo", params: { Avatar: true } });
        } else {
          alert("Please allow camera permissions to continue.");
        }
      })
      .catch((e) => {
        console.log("Error fetching camera permissions:", e);
      });
    */
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        router.push({ pathname: "/Photo", params: { pictureType: "Avatar" } });
      } else {
        alert("Please allow camera permissions to continue.");
      }
    } catch (e) {
      console.log("Error fetching camera permissions:", e);
    }
  };

  useEffect(() => {
    async function fetchPicture() {
      if (currUser && icon !== "") {
        try {
          const Avatar = await getUserPicture(icon, "Avatar");
          const backgroundImg = await getUserPicture(background, "Background");
          if (Avatar) {
            setUserIcon(Avatar);
          }
          if (backgroundImg) {
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
        <ImageBackground source={{ uri: backgroundUrl }} style={styles.image}>

          <Flex alignItems={"center"} marginTop={"1/3"}>
            <Image
              size={115}
              borderRadius={100}
              source={{ uri: userIcon }}
              alt="User Icon"
            />
            <IconButton
              icon={<Entypo name="camera" size={28} color="#FB923C" />}
              zIndex={1}
              marginTop={"-10"}
              marginLeft={"20"}
              _pressed={{ opacity: 0.5 }}
              background="transparent"
              onPress={ReTakeAvatar}
            />
          </Flex>
        </ImageBackground>
        <Flex  alignItems={"center"} overflow="hidden">
          <Heading textAlign="center" numberOfLines={2} maxWidth="90%" size="lg">{name}</Heading>
          <Text isTruncated maxW="4/5" >
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
    marginBottom: 25,
  },
});
