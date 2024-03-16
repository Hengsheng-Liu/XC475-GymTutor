import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { IUser } from '@/components/FirebaseUserFunctions';
import { firestore } from '@/firebaseConfig';
import { collection, getDoc, doc, updateDoc } from 'firebase/firestore';

import * as ImageManipulator from 'expo-image-manipulator';

const storage = getStorage();

const uploadProfileImage = async (userId: string, file: File): Promise<void> => {
  // Resize the image before uploading
//   const resizedFile = await resizeImage(file, 200, 200); // Adjust dimensions as needed

  const storageRef = ref(storage, `profileImages/${userId}/ProfilePic`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      // Handle progress or use it to show a progress bar
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% complete`);
    },
    (error) => {
      console.error('Error uploading image:', error);
    },
    () => {
      // Image uploaded successfully
      console.log('Image uploaded successfully');
    }
  );
};

// const resizeImage = async (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
//     try {
//         // Convert File to Blob
//         const blob = new Blob([file]);

//         // Resize the image
//         const resizedImage = await ImageManipulator.manipulateAsync(
//             blob,
//             [{ resize: { width: maxWidth, height: maxHeight } }],
//             { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
//         );

//         // Convert the resized image back to File
//         const resizedFile = new File([resizedImage], file.name, { type: resizedImage.type });

//         return resizedFile;
//     } catch (error) {
//         console.error('Error resizing image:', error);
//         throw error;
//     }
// };

export const getProfileImageUrl = async (userId: string): Promise<string> => {
  const storageRef = ref(storage, `profileImages/${userId}/profile.jpg`); // Adjust the path based on your file structure
  const url = await getDownloadURL(storageRef);
  return url;
};

export async function updateUser(userId: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userId);

    try {
        // Fetch the user document
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const userData = userDoc.data() as IUser;

        // Check if the user has a profile picture
        if (!userData.icon) {
            // Upload a default profile picture for the user
            const defaultProfilePicUrl = await uploadDefaultProfilePicture(userId); // Provide the default picture filename

            // Update the user document with the new 'icon' field
            await updateDoc(userRef, { icon: defaultProfilePicUrl });

            console.log(`Profile picture uploaded for user with ID ${userId}`);
        } else {
            console.log(`User with ID ${userId} already has a profile picture`);
        }
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
}

// Function to upload a default profile picture
async function uploadDefaultProfilePicture(userId:string): Promise<string> {
    // Provide the default profile picture filename
    const defaultProfilePicFileName = 'default-profile-pic.png';

    // Assuming you have the default profile picture as a file in your project
    const getDefaultProfilePicFile = async (): Promise<File> => {
        // Import the default profile picture file
        const defaultProfilePic = require("@/assets/images/default-profile-pic.png");

        // Create a File object with the fetched content
        return new File([defaultProfilePic], defaultProfilePicFileName);
    };
    
    // Usage
    const file = await getDefaultProfilePicFile();

    // Use the function to upload the default profile picture
    await uploadProfileImage(userId, file);

    // Get the URL of the uploaded default profile picture
    const defaultProfilePicUrl = await getProfileImageUrl(userId);

    return defaultProfilePicUrl;
}
export default updateUser;
