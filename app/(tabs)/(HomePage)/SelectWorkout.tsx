import React from "react";
import Tags from "../../../assets/images/checkIn/Tags.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function SelectWorkout() {
    const submitCheckIn = () => {
        router.push("/CheckInSubmit")
    }

  return (
    <CheckInRoutine navigation={submitCheckIn} Icon={Tags} Title={"Select your workout."} ButtonText={"Yes"} Tags/>

  );
}
