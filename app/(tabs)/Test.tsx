import React from "react";
import Camera from "../../assets/images/checkIn/Camera.svg";
import { Entypo } from '@expo/vector-icons';
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function Test() {
    const goPhotoPage = () =>{
        router.push("Photo")
    }
    return (
        <CheckInRoutine navigation={goPhotoPage} Icon={Camera} Title={"Take a picture to prove it."} ButtonText={"Use Camera"} lastPage/>
    )
  
}

