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
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("./FriendsChat")} >
      <FontAwesome5 name="user-friends" size={40} color="#0284C7" />
      </TouchableOpacity>
    </Row>
  );
};
/*
    <Box mb={3}>
      <Row alignItems="center" justifyContent="left">
        <Pressable
            onPress={() => router.push("/(tabs)/(GymPage)")}
            onPressOut={() => setIsPressed(false)}
            bg={isPressed ? "trueGray.200" : "#FFF"} // Change background color on hover
            >
            <Column>    
            <Text color= "trueGray.900" fontSize="xl" fontWeight="bold">{currUser.gym}</Text>
            <Text textDecorationLine="underline" color= "trueGray.900" 
                fontSize="md">Click here to change your gym</Text>
            </Column>
        </Pressable>
        <Spacer />
        <IconButton 
        size="xs"
        onPress={() => router.push("./Notifications")}
        icon={<Image source={require("@/assets/images/bell_icon.png")} />} />
      </Row>
    </Box>
*/

export default Header;
