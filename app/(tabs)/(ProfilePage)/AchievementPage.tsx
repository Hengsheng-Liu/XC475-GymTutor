import React, { useEffect } from "react";
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
import AchievementModal from "../../../components/ProfileComponents/AchievementsModal";
import { SvgUri } from "react-native-svg";
import {
  Achievementprops,
  Achievements,
  getCurrUser,
} from "@/components/FirebaseUserFunctions";
import { useAuth } from "@/Context/AuthContext";
import { background } from "native-base/lib/typescript/theme/styled-system";
const AchievementPage = () => {
  const [Complete, SetComplete] = React.useState<Achievementprops[]>([]);
  const [Uncomplete, setUncomplete] = React.useState<Achievementprops[]>([]);
  const { User } = useAuth();
  const getSVG = (name: string, achieved: boolean) => {
    if (achieved) {
      return (
        <SvgUri
          width="100"
          height="100"
          
          uri={`/assets/images/achievements/Complete/${name}.svg`}
        />
      );
    }else{
  return (
      <SvgUri
        width="100"
        height="100"
        uri={`/assets/images/achievements/Uncomplete/${name}.svg`}
      />
    );
    }
  };
  const GetUserAchievement = async () => {
    if (User) {
      try {
        const Achievement = (await getCurrUser(User.uid)).Achievement;
        const CompleteAchievements:Achievementprops[] = [];
        const UncompleteAchievements:Achievementprops[] = [];
        Object.keys(Achievement).forEach(muscleGroup => {
          const achievements = Achievement[muscleGroup as keyof Achievements];
          if (achievements) {
            achievements.forEach(achievement => {
              if(achievement.achieved){
                CompleteAchievements.push(achievement);
              }else{
                UncompleteAchievements.push(achievement);
              }
            });
          }
        });

        SetComplete(CompleteAchievements);
        setUncomplete(UncompleteAchievements);
        
      } catch (error) {
        console.error("Error fetching user achievements: ", error);
      }
    }
  
  }
  useEffect(() => {
    GetUserAchievement();
  }, []);
  return (
    <NativeBaseProvider>
      <ScrollView  style = {{backgroundColor:"#FFF",}}>
        <SafeAreaView>
          <Heading margin={2}> Earned Badges</Heading>
          <Flex flexDirection={"row"} flexWrap={"wrap"}>
            {Complete.map((achievement) => (
              <AchievementModal
                image={getSVG(achievement.name, achievement.achieved)}
                name={achievement.name}
                description={achievement.description}
                current={achievement.curr}
                max = {achievement.max}
                achieved={true}
              />
            ))}
          </Flex>
          <Flex >
            <Box borderWidth={0.5} width ={"5/6"} alignSelf ={"center"} borderColor={"muted.300"}></Box>
          </Flex>
          <Heading margin={2}> More Badges</Heading>
          <Flex flexDirection={"row"} flexWrap={"wrap"}>
            {Uncomplete.map((achievement) => (
              <AchievementModal
                image={getSVG(achievement.name, achievement.achieved)}
                name={achievement.name}
                description={achievement.description}
                current={achievement.curr}
                max = {achievement.max}
                achieved={false}
              />
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
