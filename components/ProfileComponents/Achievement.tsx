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
import { SvgAst} from "react-native-svg";

import { router } from "expo-router";
export default function Achievement() {
  return (
    <VStack mt={4}>
      <HStack>
        <Heading mr={3}>Achievement</Heading>
        <Pressable onPress={() => console.log("Edit Achievement pressed!")}>
          <FontAwesome6 name="pencil" size={22} color="black" />
        </Pressable>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        <Pressable onPress={() => router.push("/AchievementPage")}>
          <FontAwesome5 name="chevron-right" size={24} color={"#737373"} />
        </Pressable>
      </HStack>
    </VStack>
  );
}
