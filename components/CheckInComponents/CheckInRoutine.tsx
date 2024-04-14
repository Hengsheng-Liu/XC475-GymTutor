import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex, Icon} from "native-base";
import React from "react";
import { router } from "expo-router";
import { SvgProps } from "react-native-svg";
import BodyPart from "./BodyPart";
interface CheckInOneProps {
    navigation: () => void;
    Icon: React.FC<SvgProps>
    Title: string;
    ButtonText: string;
    Tags?:boolean | false;
    selectedBodyParts?: string[];
    setSelectedBodyParts?: React.Dispatch<React.SetStateAction<string[]>>; 
    Process?: boolean;
    skipPhoto?: boolean;
}
export default function CheckInRoutine(
    {navigation, Icon, Title,ButtonText, Tags, selectedBodyParts, setSelectedBodyParts
    , Process, skipPhoto = false
    }: CheckInOneProps
    
) {
  return (
    <NativeBaseProvider>
      
      <VStack backgroundColor={"#FFF"} flex={1}>
        <Flex alignItems={"center"} justifyContent={"center"}flex={1}>
          <Box> 
            <Flex flexDir={"row"} justifyContent={"center"}>
            <Icon/>
            </Flex>
            <Heading marginTop={"10"}>{Title}</Heading>
          </Box>
          <Box>
            {Tags && <BodyPart
              selectedBodyParts={selectedBodyParts || []}
              setSelectedBodyParts={setSelectedBodyParts as React.Dispatch<React.SetStateAction<string[]>>}
            />}
          </Box>
          <Center margin={"50"}>
            <Button bg={"#EA580C"} width={175} onPress={navigation}>
                <Text fontSize={20} fontWeight={700} color={"#FAFAFA"}>{ButtonText}</Text>
            </Button>
            { !Process && !skipPhoto &&
            <Pressable onPress={() => router.back()} marginTop={4} paddingX={5}>
                <Text color = {"muted.500"} >Not yet</Text>
            </Pressable>
}
            {
              skipPhoto &&
              <Pressable onPress={() => router.push("SelectWorkout")} marginTop={4} paddingX={5}>
                <Text color = {"muted.500"} >Skip</Text>
              </Pressable>
            }

          </Center>
        </Flex>
      </VStack>
    </NativeBaseProvider>
  );
}
