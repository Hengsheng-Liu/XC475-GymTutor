import React from "react";
import Tags from "../../../assets/images/checkIn/Tags.svg";
import { router } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
import { useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { DefaultAchievement, IUser } from "@/components/FirebaseUserFunctions";
import { AddDate } from "@/components/FirebaseUserFunctions";
export default function SelectWorkout() {
  const [selected, setSelected] = useState<string[]>([]);
  const { User } = useAuth();

  const submitToDatabase = async () => {
    if (!User) return;
    const userRef = doc(firestore, "Users", User.uid);
    const userData = (await getDoc(userRef)).data() as IUser;
    let UpdateAchievement = userData.Achievement;
    AddDate(User.uid);
    if (!userData.Achievement) {
      await updateDoc(userRef, {
        Achievement: DefaultAchievement,
      });
      UpdateAchievement = DefaultAchievement;
    }
    selected.forEach((part: string) => {
      UpdateAchievement[part as keyof typeof UpdateAchievement]?.forEach(
        (item) => {
          item.curr += 1;
          if (item.curr === item.max) {
            item.achieved = true;
          }
        }
      );
    });
    try {
      await updateDoc(userRef, {
        Achievement: UpdateAchievement,
      });
    } catch (error) {
      console.error("Error updating Achievement: ", error);
    }
  };

  const submitCheckIn = () => {
    if (selected.length === 0) {
      alert("Please select a workout.");
    } else {
      router.push("/CheckInSubmit");
      submitToDatabase();
    }
  };

  return (
    <CheckInRoutine
      navigation={submitCheckIn}
      Icon={Tags}
      Title={"Select your workout."}
      ButtonText={"Yes"}
      Tags
      selectedBodyParts={selected}
      setSelectedBodyParts={setSelected}
    />
  );
}
