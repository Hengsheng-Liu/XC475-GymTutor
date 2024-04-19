import React, { useEffect } from "react";
import Tags from "../../assets/images/checkIn/Tags.svg";
import { router, useLocalSearchParams } from "expo-router";
import CheckInRoutine from "@/components/CheckInComponents/CheckInRoutine";
import { useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { DefaultAchievement, IUser,Achievementprops } from "@/components/FirebaseUserFunctions";
import { AddDate } from "@/components/FirebaseUserFunctions";
import { NativeBaseProvider } from "native-base";
import {DailyProgress} from "@/components/ProfileComponents/DailyProgress";
import { Box } from "native-base";
export default function SelectWorkout() {
  const [selected, setSelected] = useState<string[]>([]);
  const [Inprogress, setInprogress] = useState<Achievementprops[]>([]);
  const [Completed, setCompleted] = useState<Achievementprops[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const { User } = useAuth();
  const { url } = useLocalSearchParams<{ url?: string}>();
  useEffect(() => {
    console.log("url=",url);
  }, []);

  const submitToDatabase = async () => {
    if (!User) return;
    const userRef = doc(firestore, "Users", User.uid);
    const userData = (await getDoc(userRef)).data() as IUser;
    const InProgressHolder:Achievementprops[] = [];
    const CompletedHolder: Achievementprops[] = [];
    let UpdateAchievement = userData.Achievement;
    AddDate(User.uid, url);
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
            CompletedHolder.push(item);
            item.achieved = true;
          }else if(item.curr < item.max){
            InProgressHolder.push(item);
          }
        }
      )
        UpdateAchievement["CheckIn"].forEach((item) => {
          item.curr += 1;
          if (item.curr === item.max) {
            CompletedHolder.push(item);
            item.achieved = true;
          }else if(item.curr < item.max){
            InProgressHolder.push(item);
          }

        }
      );
    })
    setInprogress(InProgressHolder);
    setCompleted(CompletedHolder);
    if(InProgressHolder.length > 0 || CompletedHolder.length > 0){
      setModalVisible(true);
    }else{
      router.push("/CheckInSubmit");
    }
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
      submitToDatabase();
    }
  };

  return (
    <NativeBaseProvider>
    <Box>
      <DailyProgress
        Inprogress={Inprogress}
        Completed={Completed}
        ModalVisible={ModalVisible}
        setModalVisible={setModalVisible}
      />
    </Box>
    <CheckInRoutine
      navigation={submitCheckIn}
      Icon={Tags}
      Title={"Select your workout."}
      ButtonText={"Yes"}
      Tags
      selectedBodyParts={selected}
      setSelectedBodyParts={setSelected}
      Process
    />

    </NativeBaseProvider>


  );
}
