import {
  Flex,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack,
  Box,
  Center,
} from "native-base";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import DefaultDisplay from "./DefaultDisplay";
import { router} from "expo-router";
import { SvgUri } from "react-native-svg";
import React, { useEffect } from "react";
interface AchievementProps {
  display: string[];
}

export default function Achievement(
 { display }: AchievementProps
) 
{
  const getSVG = (name: string) => {
      return (
        <SvgUri
          width="100%"
          height="100%"
          
          uri={`/assets/images/achievements/Complete/${name}.svg`}
        />
      )
  };
  
  const renderDisplay = () => {
    return Array.from({ length: 3 }, (_, index) => {
      const name = display[index] || "default"; 
      if (name === "default") {
        return <DefaultDisplay key={index} display = {display}/>;
      } else {
        return (
          <Flex
            key={index}
            width={"1/4"}
            height={"24"}
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={"muted.200"}
          >
            {getSVG(name)}
          </Flex>
        );
      }
    });
  }
  
  
  return (
    <VStack mt={4}>
      <HStack>
        <Heading mr={3}>Achievements</Heading>
        <Pressable onPress={() => router.push({pathname:"/AchievementPage",params:{edit:true,display}})}>
          <FontAwesome6 name="pencil" size={22} color="black" />
        </Pressable>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        {renderDisplay()}
        <Pressable onPress={() => router.push("/AchievementPage")}>
          <FontAwesome5 name="chevron-right" size={24} color={"#737373"} />
        </Pressable>
      </HStack>
    </VStack>
  );
}
