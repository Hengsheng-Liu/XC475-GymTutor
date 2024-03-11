import React from "react";
import { Flex, Spacer, IconButton, Pressable, Column, Input, Row, Text, Box } from "native-base";
import {Image} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { IUser } from '@/components/FirebaseDataService';
import { router } from "expo-router";

interface FriendProps {
    currUser: IUser;
}

const Header: React.FC<FriendProps> = ({ currUser }) => {
  return (
    <Box margin={2}>
      <Row alignItems="center" justifyContent="left">
        <Pressable>
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
      <Box marginTop={4}> 
        <Input
          InputLeftElement={
            <FontAwesome name="search" size={24} color ="#075985"/> 
            }
          placeholder="Enter your address to search "
          bgColor={"#F5F5F5"} 
          
        />
      </Box>
    </Box>
  );
}

export default Header;