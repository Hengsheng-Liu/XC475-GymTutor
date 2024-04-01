import { Avatar, Box, Flex, Heading, Row, Text,Column } from "native-base";
import React from "react";
import { useAuth } from "@/Context/AuthContext";
import { IUser } from "@/components/FirebaseUserFunctions";

interface HeaderProps {
  user: IUser;
}
export default function Header({ user }: HeaderProps) {

  return (
    <Flex>
      <Flex alignItems={"center"} marginBottom={2} flexDir={"row"}>
        <Avatar
          size="2xl"
          source={
            user.icon
              ? { uri: user.icon }
              : require("@/assets/images/default-profile-pic.png")
          }
        />
        <Column marginLeft={2}>
          <Heading size="lg">{user.name}</Heading>
          <Text isTruncated maxW="280" w="80%">{user.gym}</Text>
        </Column>
      </Flex>
    </Flex>
  );
}
