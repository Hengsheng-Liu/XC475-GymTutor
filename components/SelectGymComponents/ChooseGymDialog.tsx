import { AlertDialog, Button, Center } from "native-base";
import React from "react";
import { router } from "expo-router";
import { getCurrUser } from "@/components/FirebaseUserFunctions";
import { useAuth } from "../../Context/AuthContext";
import { firestore } from "../../firebaseConfig";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
interface props {
  gym: string;
  handleOpenGymDialog: (open: boolean) => void;
  OpenGymDialog: boolean;
  closeGymDialog: () => void;
}
export default function ChooseGym({
  gym,
  handleOpenGymDialog,
  closeGymDialog,
  OpenGymDialog,
}: props) {
  const cancelRef = React.useRef(null);
  const { User } = useAuth();
  const handleSubmit = async () => {
    handleOpenGymDialog(false);
    updateGym();
    router.push("/(tabs)/(GymPage)/(HomePage)/Home");
  };
  const updateGym = async () => {
    if (!User) return;
    const db = firestore;
    const userDocRef = doc(db, "Users", User.uid);
    await updateDoc(userDocRef, {
      gym: gym,
    });
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
        <AlertDialog.Body>{gym}</AlertDialog.Body>
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
