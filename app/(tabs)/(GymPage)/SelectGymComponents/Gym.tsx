
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react'
import { Avatar, Box,Flex,Heading, Row, Text} from 'native-base'
import { Pressable } from 'react-native';
export default function Gym () {
    return (
        <Box mt = {1} borderBottomColor={"#075985"} borderBottomWidth={"1"} p={5} mb ={1}>
            <Flex flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Avatar/>
                <Flex justifyContent={"flex-start"} >
                    <Heading size = "md"> Back Bay Fitness Center</Heading>
                    <Text fontSize ="sm">915 Cmmonwealth Ave, Boston</Text>
                </Flex>
                <Box>
                    <Pressable onPress={() => console.log("gym pressed")}>
                        <FontAwesome5 name="chevron-right" size={24} color="#F0F9FF" />
                    </Pressable>
                </Box>
            </Flex>
        </Box>
    )
  }