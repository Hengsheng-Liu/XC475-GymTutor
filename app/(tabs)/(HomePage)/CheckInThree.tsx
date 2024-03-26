import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex} from "native-base";
import React from "react";
import Sweat from "../../../assets/images/checkIn/Sweat.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function CheckInTwo() {
    const submitCheckIn = () => {
        router.push("/")
    }

  return (
    <CheckInRoutine navigation={submitCheckIn} Icon={Sweat} Title={"You Are Checked In!"} ButtonText={"Let's Go!"}/>
  );
}
