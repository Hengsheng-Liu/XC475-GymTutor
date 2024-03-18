import { Avatar, Box,Flex,Heading, Row, Text} from 'native-base'
import React from "react";
export default function Header(){
    return(
        <Flex flexDirection={"row"}>
          <Avatar size="2xl" source={require("../../assets/images/bob.png")} />
          <Flex ml = {2} justifyContent={"center"}>
            <Heading size="lg">Bob</Heading>
            <Text>Backbay Fitness Center</Text>
          </Flex>
        </Flex>
    )
}