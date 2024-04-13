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
  Button,
} from "native-base";
import { SafeAreaView, StyleSheet,View} from "react-native";
import AchievementModal from "../../../components/ProfileComponents/AchievementsModal";
import { firestore } from "../../../firebaseConfig";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { SvgUri } from "react-native-svg";
import {
  Achievementprops,
  Achievements,
  getCurrUser,
} from "@/components/FirebaseUserFunctions";
import { useAuth } from "@/Context/AuthContext";
import { useLocalSearchParams,router } from "expo-router";
import { getSVG } from "@/components/ProfileComponents/AchievementFunction";
const AchievementPage = () => {
  const { edit } = useLocalSearchParams();
  const [Complete, SetComplete] = React.useState<Achievementprops[]>([]);
  const [Uncomplete, SetUncomplete] = React.useState<Achievementprops[]>([]);
  const [editDisplay, setEditDisplay] = React.useState<string[]>([]);
  
  const { User } = useAuth();
  const updateUserDisplay = async () => {
    if (User) {
      try {
        await updateDoc(doc(firestore, "Users", User.uid), { display: editDisplay });
      } catch (error) {
        console.error("Error updating bio: ", error);
      }
    router.back();
  }
  }
  const GetUserAchievement = async () => {
    if (User) {
      try {
        const UserInfo = await getCurrUser(User.uid);
        const DisplayAchievement = UserInfo.display;
        const Achievement = UserInfo.Achievement;
        const CompleteAchievements: Achievementprops[] = [];
        const UncompleteAchievements: Achievementprops[] = [];
        Object.keys(Achievement).forEach((muscleGroup) => {
          const achievements = Achievement[muscleGroup as keyof Achievements];
          if (achievements) {
            achievements.forEach((achievement) => {
              if (achievement.achieved) {
                CompleteAchievements.push(achievement);
              } else {
                UncompleteAchievements.push(achievement);
              }
            });
          }
        });

        SetComplete(CompleteAchievements);
        SetUncomplete(UncompleteAchievements);
        setEditDisplay(DisplayAchievement)
        
      } catch (error) {
        console.error("Error fetching user achievements: ", error);
      }
    }
  };
  useEffect(() => {
    GetUserAchievement();
  }, []);
  return (
    <NativeBaseProvider>
      <ScrollView style={styles.container}>
          <Flex justifyContent={"flex-end"}flexDir={"column"} margin={1}>
            {Complete.length > 0 && <Box marginBottom={5}>
            <Heading marginBottom={2} marginTop={3}> Earned Badges</Heading>
            <Flex flexDirection={"row"} flexWrap={"wrap"}>
              {Complete.map((achievement) => (
                <AchievementModal
                  image={getSVG(achievement.name, achievement.achieved)}
                  name={achievement.name}
                  description={achievement.description}
                  current={achievement.curr}
                  max={achievement.max}
                  achieved={true}
                  edit={edit ? true : false}
                  setdisplay={setEditDisplay}
                  display={editDisplay}
                />
              ))}
            </Flex>
            </Box>}
            {!edit && Uncomplete.length > 0 && <Box>
            <Flex>
              <Box
                borderWidth={0.5}
                width={"95%"}
                alignSelf={"center"}
                borderColor={"muted.300"}
              ></Box>
            </Flex>
            <Heading marginTop={5} marginBottom={2}> More Badges</Heading>
            <Flex flexDirection={"row"} flexWrap={"wrap"}>
              {Uncomplete.map((achievement) => (
                <AchievementModal
                  image={getSVG(achievement.name, achievement.achieved)}
                  name={achievement.name}
                  description={achievement.description}
                  current={achievement.curr}
                  max={achievement.max}
                  achieved={false}
                />
              ))}
            </Flex>
            </Box>}
          </Flex>

      </ScrollView>
      {edit && 
      <Flex flexDir={"row"} justifyContent={"space-around"} backgroundColor={"#FFF"} paddingBottom={5}>
         <Button backgroundColor={"#F97316"} width = {"1/3"} borderRadius = {"15"}  onPress={updateUserDisplay}>Submit</Button>
       <Button backgroundColor={"#F97316"} width={"1/3"} borderRadius = {"15"} onPress={() => router.navigate("/ProfilePage")}>Cancel</Button>
     
      </Flex>
      }
    </NativeBaseProvider>
  );
};
export default AchievementPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});

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
