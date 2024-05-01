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
import { router } from "expo-router";
import { SvgUri } from "react-native-svg";
import React, { useEffect, useState } from "react";
import getSVG from "./AchievementFunction";
import { getAchievement } from "../FirebaseUserFunctions";
interface AchievementProps {
  display: string[];
}

export default function Achievement({ display }: AchievementProps) {
  const [SVGS, setSVGS] = useState<React.JSX.Element[] | null>(null);
  useEffect(() => {
    const fetchAchievementUrls = async () => {
      try {
        const tmp = [];
        for (const name of display) {
          const achievementPath = `/Achievement/Complete/${name.replace(/\s/g, "")}Colored.svg`;
          const achievementUrl = await getAchievement(achievementPath);
          tmp.push(
            <SvgUri key={name} uri={achievementUrl} width="100%" height="100%" />
          );
        }
        setSVGS(tmp);
      } catch (error) {
        console.error("Error fetching achievement:", error);
      }
    };
  
    fetchAchievementUrls();
  }, [display]);
  
  const renderDisplay = () => {
    return Array.from({ length: 3 }, (_, index) => {
      const name = display[index] || "default";
      if (name === "default") {
        return <DefaultDisplay key={index} display={display} />;
      } else {
        return (
          <Flex
            key={index}
            width={"1/4"}
            height={"24"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Flex width="100%" height="100%" borderRadius={10} overflow="hidden"
            justifyContent={"center"} alignItems={"center"} backgroundColor={"muted.200"}
            >
              {SVGS ? SVGS[index] : <Center><Text>Loading...</Text></Center>}
            </Flex>
          </Flex>
        );
      }
    });
  };

  return (
    <VStack mt={4}>
      <HStack>
        <Heading mr={3} mb={1}>
          Achievements
        </Heading>
        <Pressable
          mt = {1}
          onPress={() => router.push({pathname:"/AchievementPage",params:{edit:true,display}})}
          _pressed={{ opacity: 0.5 }}
        >
          <FontAwesome6 name="pencil" size={20} color="black" />
        </Pressable>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        {renderDisplay()}
        <Pressable
          onPress={() => router.push("/AchievementPage")}
          _pressed={{ opacity: 0.5 }}
        >
          <FontAwesome5 name="chevron-right" size={24} color={"#737373"} />
        </Pressable>
      </HStack>
    </VStack>
  );
}
