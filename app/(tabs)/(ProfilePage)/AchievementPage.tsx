import React from "react";
import { VStack, Heading, Center, Text, NativeBaseProvider } from "native-base";
import { SafeAreaView } from "react-native";
const AchievementPage = () => {
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <VStack>
          <Heading>Achievement</Heading>
          <Center>
            <Text>FitFriendship</Text>
            <Text>SocialButterfly</Text>
            <Text>CheckInChampion</Text>
          </Center>
        </VStack>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};
export default AchievementPage;
