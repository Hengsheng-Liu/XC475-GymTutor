import React from "react";
import {
  VStack,
  Heading,
  Center,
  Text,
  NativeBaseProvider,
  Flex,
  Box,
  Spacer,
  ScrollView,
  HStack,
} from "native-base";
import { SafeAreaView } from "react-native";
import FitFriend from "../../../assets/images/achievements/FitFriendship.svg";
import SocialButterfly from "../../../assets/images/achievements/SocialButterfly.svg";
import CheckInChampion from "../../../assets/images/achievements/CheckInChampion.svg";
import IronDedication from "../../../assets/images/achievements/IronDedication.svg";
import ConsistencyConqueror from "../../../assets/images/achievements/ConsistencyConqueror.svg";
const AchievementPage = () => {
  const ahievements = [
    {
      name: "FitFriend",
      description: "You have made 5 friends on FitMate!",
      image: FitFriend,
    },
    {
      name: "SocialButterfly",
      description: "You have attended 5 events!",
      image: SocialButterfly,
    },
    {
      name: "CheckInChampion",
      description: "You have checked in 10 times!",
      image: CheckInChampion,
    },
    {
      name: "IronDedication",
      description: "You have attended 10 events!",
      image: IronDedication,
    },
    {
      name: "ConsistencyConqueror",
      description: "You have checked in 20 times!",
      image: ConsistencyConqueror,
    },
  ];
  return (
        <NativeBaseProvider>
        <ScrollView>
          <SafeAreaView>
      
        <Flex flexDirection={"row"}  flexWrap={"wrap"} >
            {ahievements.map((achievement, index) => (
              <Flex key={index} h="20" w="20" width={"1/3"} borderWidth={1} justifyContent={"center"} alignItems={"center"}>
                <achievement.image/>
              </Flex>
            ))}
        </Flex>            
           
          </SafeAreaView>
          </ScrollView>
        </NativeBaseProvider>
  );
};
export default AchievementPage;

/*
        <VStack mt={3}>
          <Spacer />
          <ScrollView>
            <VStack space={4}>
              {ahievements.map((achievement) => (
                <Center>
                  <Flex
                    direction="row"
                    bg="white"
                    shadow={3}
                    rounded="md"
                    p={4}
                    w="90%"
                  >
                    <Box h="20" w="20">
                      <achievement.image />
                    </Box>
                    <Box>
                      <Heading mb={2} fontSize={"sm"}>
                        {achievement.name}
                      </Heading>
                      <Text>{achievement.description}</Text>
                    </Box>
                  </Flex>
                </Center>
              ))}
            </VStack>
          </ScrollView>
        </VStack>

*/
