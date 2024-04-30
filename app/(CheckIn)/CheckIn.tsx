import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex} from "native-base";
import React from "react";
import CheckCircle from "../../assets/images/checkIn/CheckCircle.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function CheckIn() {
    const submitCheckIn = () => {      
      router.push("/DailyPicture")
    }
  return (
        <CheckInRoutine navigation={submitCheckIn} Icon={CheckCircle} Title={"Are you ready to check in?"} ButtonText={"Yes"}/>
  );
}
