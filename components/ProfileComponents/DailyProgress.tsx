import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Modal,
  VStack,
  Spacer,
  Heading,
  Text,
  Box,
  Flex,
  Progress,
} from "native-base";
import { Achievementprops } from "../FirebaseUserFunctions";
import  getSVG  from "./AchievementFunction";
import { router } from "expo-router";
interface DailyProgressProps {
  Inprogress: Achievementprops[];
  Completed: Achievementprops[];
  ModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DailyProgress({
  Inprogress,
  Completed,
  ModalVisible,
  setModalVisible,
}: DailyProgressProps) {
  return (
    <Center>
      <Modal isOpen={ModalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
          <Center>
            <Modal.Header>Daily Achievements!</Modal.Header>
          </Center>
          <Modal.Body>
            <VStack mt={3}>
              <Spacer />

              <VStack space={4}>
              {Completed.map((achievement) => (
                  <EachProgress  achievement = {achievement} achieved = {true}/>
                ))}
                {Inprogress.map((achievement) => (
                  <EachProgress  achievement = {achievement} achieved = {false}/>
                ))}
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                background={"#EA580C"}
                _pressed={{opacity: 0.5}}
                onPress={() => {
                  setModalVisible(false);
                  router.push("/Home");
                }}
              >
                <Text fontSize="md" color="#FFFFFF">Let's Go!</Text>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}
interface EachProgressProps {
    achievement: Achievementprops;
    achieved: boolean;
}
const EachProgress = (
    { achievement, achieved }: EachProgressProps
) => {
  return (
    <Center>
      <Flex direction="row" bg="white" shadow={3} rounded="md" p={4} w="95%">
        <Box h="16" w="16">
          {getSVG(achievement.name, true)}
        </Box>
        <Box marginLeft={5} width={"60%"} >
          <Heading mb={2} fontSize={"sm"} isTruncated>
            {achievement.name}
          </Heading>
          {achieved ? (
            <Text>Accomplished!</Text>
          ) : (
            <Progress
              colorScheme="warning"
              value={(achievement.curr / achievement.max) * 100}
            />
          )}
        </Box>
      </Flex>
    </Center>
  );
};
