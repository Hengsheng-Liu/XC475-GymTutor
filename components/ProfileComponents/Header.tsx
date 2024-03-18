import { Avatar, Box, Flex, Heading, Row, Text } from "native-base";
import React from "react";
import { useAuth } from "@/Context/AuthContext";
interface HeaderProps {
  name: string;
  icon?: string;
  gym: string;
}
export default function Header({ name, icon, gym }: HeaderProps) {
  const { currUser } = useAuth();
  if (!currUser) return;

  return (
    <Flex>
      <Flex alignItems={"center"} marginBottom={2}>
        <Avatar
          size="2xl"
          source={
            currUser.icon
              ? { uri: currUser.icon }
              : require("@/assets/images/default-profile-pic.png")
          }
        />
        <Heading size="lg">{name}</Heading>
        <Text>{gym}</Text>
      </Flex>
    </Flex>
  );
}
