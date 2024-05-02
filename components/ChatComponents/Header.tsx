import React, { useState } from "react";
import { Flex, Spacer, Column, Row, Text, Box, Heading } from "native-base";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { FontAwesome5, Octicons } from '@expo/vector-icons';

interface FriendProps {
  GymName: string;
}

const Header = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Row
      mb={2}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Column> 
        <Heading size="md" color="trueGray.900" > Message</Heading>
        <Text> Keep in touch with your friends</Text>
        <Spacer/>
      </Column>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/FriendsChatCopy")} >
      <FontAwesome5 name="user-friends" size={40} color="#0284C7" />
      </TouchableOpacity>
    </Row>
  );
};

export default Header;
