import { NativeBaseProvider, Heading, VStack, Center, Box, Button, Pressable,Text,Flex} from "native-base";
import React from "react";
import CheckOut from "../../../assets/images/checkIn/CheckOut.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function CheckInThree() {
    const submitCheckIn = () => {
        router.push("/")
    }

  return (
    <CheckInRoutine navigation={submitCheckIn} Icon={CheckOut} Title={"You Are Checked In!"} ButtonText={"Let's Go!"}/>
  );
}
