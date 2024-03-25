import { Avatar, Box, Flex, Heading, Row, Text,Column } from "native-base";
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
      <Flex alignItems={"center"} marginBottom={2} flexDir={"row"}>
        <Avatar
          size="2xl"
          source={
            currUser.icon
              ? { uri: currUser.icon }
              : require("@/assets/images/default-profile-pic.png")
          }
        />
        <Column marginLeft={2}>
          <Heading size="lg">{name}</Heading>
          <Text isTruncated maxW="280" w="80%">{gym}</Text>
        </Column>
      </Flex>
    </Flex>
  );
}
