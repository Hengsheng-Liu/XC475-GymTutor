
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react'
import { Avatar, Box,Flex,Heading, Row, Text} from 'native-base'
import { Pressable } from 'react-native';
interface props {
    title: string;
    Address: string;
  
}
export default function Gym ({title, Address}: props) {
    return (
        <Box mt = {1} borderBottomColor={"#075985"} borderBottomWidth={"1"} p={5} mb ={1}>
            <Flex flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Avatar/>
                <Flex justifyContent={"flex-start"} >
                    <Heading size = "md"> {title}</Heading>
                    <Text fontSize ="sm">{Address}</Text>
                </Flex>
                <Box>
                    <Pressable onPress={() => console.log({title},"pressed")}>
                        <FontAwesome5 name="chevron-right" size={24} color="#F0F9FF" />
                    </Pressable>
                </Box>
            </Flex>
        </Box>
    )
  }