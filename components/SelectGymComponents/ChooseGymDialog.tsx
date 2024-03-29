import { AlertDialog, Button, Center } from "native-base";
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
  const { User, updateUserGym } = useAuth();
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
    const gymDocRef = doc(db, "Gyms", place_id);
    try {
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
        await setDoc(
          gymDocRef,
          {
            members: members,
            bounding: bound,
          },
          { merge: true }
        );
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
    updateUserGym(place_id, title);
    handleOpenGymDialog(false);
    updateUserGym2();
    updateGym();
    router.push("/(tabs)/(HomePage)/Home");
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
          Want Choose this Gym as your Gym?
        </AlertDialog.Header>
        <AlertDialog.Body>{title}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              colorScheme="coolGray"
              onPress={closeGymDialog}
              ref={cancelRef}
            >
              Cancel
            </Button>
            <Button colorScheme="green" onPress={handleSubmit}>
              Submit
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
