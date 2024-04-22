import React from "react";
import CameraSVG from "../../assets/images/checkIn/Camera.svg";
import { Camera } from "expo-camera";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
export default function Test() {
  const goPhotoPage = () => {

    const permissionFunction = async () => {
      try{
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        router.push({ pathname: "/Photo", params: { pictureType: "CheckIn" } });

      } else {
        alert("Please allow camera permissions to continue.");
        router.push("/SelectWorkout");
      }
    }catch(e){
      console.log("Error fetching camera permissions:", e);
    }
  }
    /*
    Camera.getCameraPermissionsAsync()
      .then((perm) => {
        // Assuming perm.granted is a boolean indicating permission status
        if (perm.granted) {
          router.push("/Photo");
        } {
          alert("Please allow camera permissions to continue.");
          router.push("/SelectWorkout")
        }
      })
      .catch((e) => {
        console.log("Error fetching camera permissions:", e);
      });
      */
    permissionFunction();
  };

  return (
    <CheckInRoutine
      navigation={goPhotoPage}
      Icon={CameraSVG}
      Title={"Take a picture to prove it."}
      ButtonText={"Use Camera"}
      skipPhoto
    />
  );
}
