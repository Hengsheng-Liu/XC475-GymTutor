import { AlertDialog, Button, Center } from "native-base";
import React from "react";
import { router } from "expo-router";
import { getCurrUser } from "@/components/FirebaseUserFunctions";
import { useAuth } from "../../Context/AuthContext";
import { firestore } from "../../firebaseConfig";
import { doc, setDoc, updateDoc,getDoc} from "firebase/firestore";
import { Geometry } from "react-native-google-places-autocomplete";
interface props {
  title: string;
  handleOpenGymDialog: (open: boolean) => void;
  OpenGymDialog: boolean;
  closeGymDialog: () => void;
  place_id: string;
  Geometry: Geometry;
}
export default function ChooseGym({
  title,
  handleOpenGymDialog,
  closeGymDialog,
  OpenGymDialog,
  place_id,
  Geometry,
}: props) {
  const cancelRef = React.useRef(null);
  const { User } = useAuth();
  const db = firestore;
  const updateUserGym = async () => {
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
  
      let members:string[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        members = data.members ? [...data.members] : [];
      }
      if (!members.includes(User.uid)) {
        members.push(User.uid);
      }
  
      await setDoc(gymDocRef, {
        name: title,
        members: members,
        Geometry: Geometry,
      }, { merge: true });
  
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleSubmit = async () => {
    handleOpenGymDialog(false);
    updateUserGym();
    updateGym();
    router.push("/(tabs)/(GymPage)/(HomePage)/Home");
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
