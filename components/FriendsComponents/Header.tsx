import { Avatar, Box, Flex, Heading, Row, Text,Column } from "native-base";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import { IUser } from "@/components/FirebaseUserFunctions";
import { getUserIcon } from "@/components/FirebaseUserFunctions";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";

interface HeaderProps {
  user: IUser;
}
export default function Header({ user }: HeaderProps) {
  const [friendIcon, setFriendIcon] = useState<string>();
  const friend = user; 
  const {currUser} = useAuth();
  if (!currUser) return;

  useEffect(() => {
      async function fetchIcon() {
          if (currUser && friend.icon !== "") {
            try {
              const url = await getUserIcon(friend.icon);
              // console.log("Found Icon URL: ", url);
              setFriendIcon(url);
            } catch (error) {
              console.error("Failed to fetch friend icon:", error);
              // Handle the error e.g., set a default icon or state
              const url = await getUserIcon("Icon/Default/Avatar.png");
              console.log("Used default Icon URL: ", url)
              setFriendIcon(url);
            }
          } else {
          const url = await getUserIcon("Icon/Default/Avatar.png");
          // console.log("Used default Icon URL: ", url)
          setFriendIcon(url);
        }
      }

      if (currUser) {
          fetchIcon();
      }
    }, [currUser, friend.uid,friend.icon]); // Depend on currUser and friend.uid

  return (
    <Flex>
      <Flex alignItems={"center"} marginBottom={2} flexDir={"row"}>
        <Avatar
          size="2xl"
          source={{ uri: friendIcon}
          }
        />
        <Column marginLeft={2}>
          <Heading size="lg" color="trueGray.900">{user.name}</Heading>
          <Text color= "trueGray.900" fontSize="sm" numberOfLines={2} isTruncated maxWidth="80%">{user.gym}</Text>
        </Column>
      </Flex>
    </Flex>
  );
}
