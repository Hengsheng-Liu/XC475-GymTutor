import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Flex, Heading, Input, Row, Text, Box } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export default function Title() {
  return (
    <Box margin={2}>
      <Flex justifyContent={"space-between"} flexDirection={"row"}>
        <Box>
          <Heading> Select your gym </Heading>
          <Text> Please select your gym to continue </Text>
        </Box>
        <FontAwesome name="map-o" size={50} color="#F0F9FF" />
      </Flex>
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
const styles = StyleSheet.create({});
