import { NativeBaseProvider, Spacer, Heading, VStack, Row, Center, Box, Button, Pressable,Text,Flex, Icon} from "native-base";
import React from "react";
import { router } from "expo-router";
import { SvgProps } from "react-native-svg";
import BodyPart from "./BodyPart";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';

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
      <SafeAreaView style= {{backgroundColor:"#FFFFFF", flex:1}}>
        <Flex alignItems={"center"} justifyContent={"center"}flex={1}>
          <Box> 
            <Flex flexDir={"row"} justifyContent={"center"}>
              <Icon/>
            </Flex>
            <Heading marginTop="10" mb="8" textAlign="center">{Title}</Heading>
          </Box>
          <Box alignItems="center">
            {Tags && <BodyPart
              selectedBodyParts={selectedBodyParts || []}
              setSelectedBodyParts={setSelectedBodyParts as React.Dispatch<React.SetStateAction<string[]>>}
            />}
          </Box>
            <Button background="#EA580C" rounded={10} width={175} _pressed={{opacity: 0.5}} onPress={navigation}>
                <Text fontSize={20} fontWeight={700} color={"#FAFAFA"}>{ButtonText}</Text>
            </Button>
            {
              skipPhoto &&
              <Pressable _pressed={{opacity: 0.5}} onPress={() => router.replace("/SelectWorkout")} marginTop={3} paddingX={5}>
                <Text color = {"muted.500"} fontSize="md" >Skip photo</Text>
              </Pressable>
            }
            {
              Process &&
              <Pressable _pressed={{opacity: 0.5}} onPress={() => router.replace("/Home")} marginTop={3} paddingX={5}>
                <Text color = {"muted.500"} fontSize="md" >Not Yet</Text>
              </Pressable>
            }        
        </Flex>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
