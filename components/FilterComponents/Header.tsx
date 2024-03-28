import React, { useState } from "react";
import {
  Flex,
  Spacer,
  IconButton,
  Pressable,
  Column,
  Row,
  Text,
  Box,
  Heading,
} from "native-base";
import { Image } from "react-native";
import { IUser } from "@/components/FirebaseUserFunctions";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";


const Header = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Box borderBottomWidth={1} borderBottomColor="#0C4A6E" pt={5} >
      <Flex flexDirection={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
        <Pressable pr={2} onPress={() => router.push("./Home")}>
          <FontAwesome name="chevron-left" size={30} color="#0C4A6E" />
        </Pressable>
        <Spacer/>
        <Box>
          <Text color= "trueGray.900" fontSize="md" fontWeight="bold" >Filters</Text> 
        </Box>
        <Spacer/>
        <Pressable pr={2} onPress={() => router.push("./Home")}>
          <Text color= "trueGray.900" fontSize="md" fontWeight="bold">Reset</Text>
        </Pressable>
      </Flex>
    </Box>
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
