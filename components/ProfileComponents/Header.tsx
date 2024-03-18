import { Avatar, Box, Flex, Heading, Row, Text } from 'native-base'
import React from "react";
import { useAuth } from "@/Context/AuthContext";

export default function Header() {
  const { currUser } = useAuth();
  if (!currUser) return;

  return (
    <Flex flexDirection={"row"}>
      <Avatar size="2xl" source={currUser.icon ? { uri: currUser.icon } : require("@/assets/images/default-profile-pic.png")} />
      <Flex ml={2} justifyContent={"center"}>
        <Heading size="lg">Bob</Heading>
        <Text>Backbay Fitness Center</Text>
      </Flex>
    </Flex>
  )
}