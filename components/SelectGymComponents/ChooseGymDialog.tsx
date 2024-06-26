import { AlertDialog, Button, Center, Text } from "native-base";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { getCurrUser } from "@/components/FirebaseUserFunctions";
import { useAuth } from "../../Context/AuthContext";
import { firestore } from "../../firebaseConfig";
import { doc, setDoc, updateDoc, getDoc, GeoPoint } from "firebase/firestore";
import { Geometry } from "react-native-google-places-autocomplete";
import { nominatimGymSearch } from "../GeolocationFunction";

interface props {
  title: string;
  handleOpenGymDialog: (open: boolean) => void;
  OpenGymDialog: boolean;
  closeGymDialog: () => void;
  place_id: string;
  Geometry: Geometry;
  Address: string;
}
export default function ChooseGym({
  title,
  handleOpenGymDialog,
  closeGymDialog,
  OpenGymDialog,
  place_id,
  Geometry,
  Address,
}: props) {
  const cancelRef = React.useRef(null);
  const { User, currUser, userGym, updateUserGym } = useAuth();
  const db = firestore;
  const [gymBounding, setGymBounding] = React.useState<GeoPoint[]>();

  const updateUserGym2 = async () => {
    if (!User) return;
    const userDocRef = doc(db, "Users", User.uid);
    await updateDoc(userDocRef, {
      gym: title,
      gymId: place_id,
    });
  };

  const updateGym = async () => {
    if (!User) return;
    if (currUser && userGym && userGym[0] !== "" && userGym[1] !== "") {
      console.log("Updating previous gym", userGym[0], userGym[1]);
      const prevGymDocRef = doc(db, "Gyms", userGym[0]);
      try {
        const docSnap = await getDoc(prevGymDocRef);
        let members: string[] = [];
        if (docSnap.exists()) {
          const data = docSnap.data();
          members = data.members ? [...data.members] : [];
          if (members.includes(User.uid)) {
            members = members.filter((member) => member !== User.uid);
          }
          await updateDoc( prevGymDocRef, { members: members });
          console.log("Updated previous gym members:", members);
        } 
      } catch (error) {
        console.error("Error updating previous gym:", error);
      } }
  
    const gymDocRef = doc(db, "Gyms", place_id);
    try {
      console.log("Updating new gym", place_id, title);
      const docSnap = await getDoc(gymDocRef);
      let members: string[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        const bound = await nominatimGymSearch(Geometry);
        setGymBounding(bound);
        members = data.members ? [...data.members] : [];
        if (!members.includes(User.uid)) {
          members.push(User.uid);
        }
        await updateDoc( gymDocRef, { members: members });
        console.log("Updated gym members:", members);
      } else {
        const bound = await nominatimGymSearch(Geometry);
        setGymBounding(bound);
        await setDoc(
          gymDocRef,
          {
            name: title,
            address: Address,
            members: [User.uid],
            geometry: Geometry,
            bounding: bound,
          },
          { merge: true }
        );    
      }
    } catch (error) {
      console.error("Error updating gym:", error);
    }
  };

  const handleSubmit = async () => {
    updateGym();
    updateUserGym(place_id, title);
    handleOpenGymDialog(false);
    updateUserGym2();
    router.replace("/Home");
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={OpenGymDialog}
      onClose={closeGymDialog}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>
          Do you want to choose this gym?
        </AlertDialog.Header>
        <AlertDialog.Body>{title}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              background="#A3A3A3" shadow="3" 
              _pressed={{opacity: 0.7}}
              onPress={closeGymDialog}
              ref={cancelRef}
            >
              <Text color="#FFF" fontWeight="bold">Cancel</Text>
            </Button>
            <Button background={"#F97316"} shadow="3" onPress={handleSubmit}
              _pressed={{opacity: 0.7}}
              >
              <Text color="#FFF" fontWeight="bold">Submit</Text>
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
