import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex, Icon} from "native-base";
import React from "react";
import CheckCircle from "../../../assets/images/checkIn/CheckCircle.svg";
import { router } from "expo-router";
import { SvgProps } from "react-native-svg";

interface CheckInOneProps {
    navigation: () => void;
    Icon: React.FC<SvgProps>
    Title: string;
    ButtonText: string;

}
export default function CheckInRoutine(
    {navigation, Icon, Title,ButtonText}: CheckInOneProps
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
          <Center marginTop={"1/2"}>
            <Button bg={"#EA580C"} width={175} onPress={navigation}>
                <Text fontSize={20} fontWeight={700} color={"#FAFAFA"}>{ButtonText}</Text>
            </Button>
            <Pressable onPress={() => router.back()} marginTop={4} paddingX={5}>
                <Text color = {"muted.500"} >Not yet</Text>
            </Pressable>
          </Center>
        </Flex>
      </VStack>
    </NativeBaseProvider>
  );
}
