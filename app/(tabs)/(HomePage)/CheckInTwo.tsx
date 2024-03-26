import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex} from "native-base";
import React from "react";
import Tags from "../../../assets/images/checkIn/Tags.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function CheckInTwo() {
    const submitCheckIn = () => {
        router.push("CheckInThree")
    }

  return (
    <CheckInRoutine navigation={submitCheckIn} Icon={Tags} Title={"Select your workout."} ButtonText={"Yes"}/>
  );
}
