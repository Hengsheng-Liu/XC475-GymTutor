import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Column,
  IconButton,
  Image,
} from "native-base";
import { useAuth } from "@/Context/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Camera } from "expo-camera";

interface HeaderProps {
  name: string;
  icon: string;
  gym: string;
}

export default function Header({ name, icon, gym }: HeaderProps) {
  const { currUser } = useAuth();
  const [userIcon, setUserIcon] = useState<string>(
    require("@/assets/images/default-profile-pic.png")
  );

  const GetUserIcon = async (iconUrl: string) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, iconUrl);
      const url = await getDownloadURL(storageRef);
      setUserIcon(url);
    } catch (error) {
      console.error("Error getting user icon: ", error);
      setUserIcon(require("@/assets/images/default-profile-pic.png"));
    }
  };
  const ReTakeAvatar = () => {
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
  };

  useEffect(() => {
    if (currUser && icon) {
      GetUserIcon(icon);
    }
  }, [icon, currUser]);

  if (!currUser) return null;

  return (
    <Flex>
      <Flex alignItems={"center"} marginBottom={2} flexDir={"row"}>
        <Box>
          <Image
            size={130}
            borderRadius={100}
            source={{ uri: userIcon }}
            alt="User Icon"
          />
          <IconButton
            icon={<Entypo name="camera" size={28} color="#FB923C" />}
            zIndex={1}
            marginTop={"-10"}
            marginLeft={"20"}
            onPress={ReTakeAvatar}
          />
        </Box>
        <Column marginLeft={2}>
          <Heading size="lg">{name}</Heading>
          <Text isTruncated maxW="280" w="80%">
            {gym}
          </Text>
        </Column>
      </Flex>
    </Flex>
  );
}
