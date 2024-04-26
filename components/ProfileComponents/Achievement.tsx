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
import { getSVG } from "./AchievementFunction";
interface AchievementProps {
  display: string[];
}

export default function Achievement(
 { display }: AchievementProps
) 
{  
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
          >
            <Box
              width="100%"
              height="100%"
              borderRadius={10}
              overflow="hidden"
            >{getSVG(name,true)}</Box>
          </Flex>
        );
      }
    });
  }
  
  
  return (
    <VStack mt={4}>
      <HStack>
        <Heading mr={3} mb= {1}>Achievements</Heading>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        {renderDisplay()}
        <Pressable onPress={() => router.push("/AchievementPage")} _pressed={{opacity:0.5}}>
          <FontAwesome5 name="chevron-right" size={24} color={"#737373"} />
        </Pressable>
      </HStack>
    </VStack>
  );
}
