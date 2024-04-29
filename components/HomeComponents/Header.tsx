import React, { useState } from "react";
import { Flex, Spacer, Button, Row, Text, Box, Heading } from "native-base";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';

interface FriendProps {
  GymName: string;
}

const Header: React.FC<FriendProps> = ({ GymName }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Row
      mb={2} mr="1" ml="1"
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Row flex={1} justifyContent={"left"} justifyItems={"left"}>
      <Button maxW="95%" justifyContent={"left"} justifyItems={"left"} p={0} m={0} flex={1} _pressed={{opacity: 0.5}} background="transparent" onPress={() => router.push("/(tabs)/(HomePage)/")} >
        <Heading size="md" color="trueGray.900" isTruncated >
            {GymName}
          </Heading>
          <Text underline >Click to change your gym</Text>
      </Button>
      </Row>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("./Notifications")} >
        <Octicons name="bell" size={36} color="#F97316" />
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
