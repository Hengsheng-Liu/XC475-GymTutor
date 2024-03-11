import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Flex, Heading, Input, Row, Text, Box, } from "native-base";

import { FontAwesome } from "@expo/vector-icons";

interface props {
  title: string;
  subtitle: string;
  Icon: React.ReactNode
  SearchBarText: string;
  SearchFeature?: Function; 
}
//<FontAwesome name="map-o" size={50} color="#F0F9FF" />
export default function GeneralHeading({ title, subtitle, Icon, SearchBarText,SearchFeature }: props) {
  return (
    <Box margin={2}>
      <Flex justifyContent={"space-between"} flexDirection={"row"}>
        <Box>
          <Heading> {title} </Heading>
          <Text> {subtitle} </Text>
        </Box>
        {Icon}
      </Flex>
      <Box marginTop={4}>
        <Input
          InputLeftElement={
            <FontAwesome name="search" size={24} color="#075985" />
        }
            onSubmitEditing={(e) => console.log(e.nativeEvent.text)}
          placeholder={SearchBarText}
          bgColor={"#F5F5F5"}
        />
      </Box>
    </Box>
  );
}
