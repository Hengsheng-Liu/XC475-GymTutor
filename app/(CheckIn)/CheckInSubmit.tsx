import React from "react";
import CheckOut from "../../assets/images/checkIn/CheckOut.svg";

import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function CheckInSubmit() {
    const submitCheckIn = () => {
        router.replace("/Home")
        
    }

  return (
        <CheckInRoutine navigation={submitCheckIn} Icon={CheckOut} Title={"You Are Checked In!"} ButtonText={"Let's Go!"} Process/>

  );
}
