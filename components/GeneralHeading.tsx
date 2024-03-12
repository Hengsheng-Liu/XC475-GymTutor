import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Flex, Heading, Input, Row, Text, Box } from "native-base";

import { FontAwesome } from "@expo/vector-icons";

/* This is the heading component that is used for the Gym page and you could 
Based on it 
*/
export default function GeneralHeading() {
  return (
    <Box margin={2}>
      <Flex justifyContent={"space-between"} flexDirection={"row"}>
        <Box>
          <Heading>
            {/*This is the title of the page that you might need to change*/}
            title{" "}
          </Heading>
          {/*This is the subtile that's on the bottom of the heading  */}
          <Text> subtitle </Text>
        </Box>
        {/*This is the Icon on the right side of the heading that you need to change */}
        <FontAwesome name="map-o" size={50} color="#F0F9FF" />
      </Flex>
      <Box marginTop={4}>
        {/* This is the input box and InputLeftElement is the icon on the left side of the input
         which I would recommend just to keep it as it is */}
        <Input
          InputLeftElement={
            <FontAwesome name="search" size={24} color="#075985" />
          }
          placeholder={"Search"}
          bgColor={"#F5F5F5"}
        />
      </Box>
    </Box>
  );
}
