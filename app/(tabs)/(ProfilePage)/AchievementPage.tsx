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
const AchievementPage = () => {
  const [UserAchievements, setAchievements] = React.useState<Achievementprops[]>([]);
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
        const newAchievements:Achievementprops[] = [];
        Object.keys(Achievement).forEach(muscleGroup => {
          const achievements = Achievement[muscleGroup as keyof Achievements];
          achievements.forEach(achievement => {
            newAchievements.push(achievement);
          });
        });

        setAchievements(newAchievements);
        console.log("User Achievements: ", UserAchievements);
      } catch (error) {
        console.error("Error fetching user achievements: ", error);
      }
    }
  
  }
  useEffect(() => {
    GetUserAchievement();
    console.log("User Achievements: ", UserAchievements);

  }, []);
  return (
    <NativeBaseProvider>
      <ScrollView>
        <SafeAreaView>
          <Heading margin={2}> Earned Badges</Heading>
          <Flex flexDirection={"row"} flexWrap={"wrap"}>
            {UserAchievements.map((achievement) => (
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
