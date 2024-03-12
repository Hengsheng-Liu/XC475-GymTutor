import React, {useState} from "react";
import { Flex, Spacer, IconButton, Pressable, Column, Row, Text, Box } from "native-base";
import {Image} from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions';
import { router } from "expo-router";

interface FriendProps {
    currUser: IUser;
}

const Header: React.FC<FriendProps> = ({ currUser }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Box mb={3}>
      <Row alignItems="center" justifyContent="left">
        <Pressable
            onPress = {() => router.push("/(tabs)/(GymPage)/SelectGym")}
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
  );
}

export default Header;