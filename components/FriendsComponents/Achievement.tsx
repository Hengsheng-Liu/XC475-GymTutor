import { HStack, Heading, Pressable, VStack } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";

import { router } from "expo-router";
export default function Achievement() {
  return (
    <VStack mt={4}>
      <HStack>
        <Heading mr={3} color="trueGray.900">Achievements</Heading>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        <Pressable onPress={() => router.push("/AchievementPage")}>
          <FontAwesome5 name="chevron-right" size={24} color={"#737373"} />
        </Pressable>
      </HStack>
    </VStack>
  );
}
