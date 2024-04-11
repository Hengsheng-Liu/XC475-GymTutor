import { StatusBar } from "expo-status-bar";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useState, useRef, useContext } from "react";
import { Button, TouchableOpacity, Image } from "react-native";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, uploadBytes } from "firebase/storage";
import { Box, NativeBaseProvider, Flex } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
export default function App() {
  let camRef = useRef<Camera>(null);
  const [type, setType] = useState(CameraType.back);
  const [CameraPermission, setcameraPermission] = useState(false);
  //const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = Camera.useCameraRollPermissions();
  const { User } = useAuth();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [base64Img, setBase64Img] = useState(null);

  useEffect(() => {
    const getCamPermission = async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      console.log(status);
      setcameraPermission(status === "granted");
    };
    getCamPermission();
  }, []);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function openCamera() {
    /*
   if (cameraOpen) {
     const perm = await Camera.getCameraPermissionsAsync();
     requestPermission();
   }
   */
    setCameraOpen(!cameraOpen);
  }

  async function takePicture() {
    if (camRef.current) {
      const picture = await camRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });
      setBase64Img(picture.base64);
    }
  }

  async function uploadImage() {
    try {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `images/${User?.uid}/${new Date().toISOString()}.png`
      );
  
      // Convert base64 string to a Blob
      const fetchResponse = await fetch(`data:image/png;base64,${base64Img}`);
      const blob = await fetchResponse.blob();
  
      // Upload the Blob to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log("Image uploaded to: ", uploadResult.metadata.fullPath);
      if (uploadResult.metadata.fullPath) {
        alert("Image uploaded to: " + uploadResult.metadata.fullPath);
        reset();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle the error as needed, such as displaying a message to the user or logging it
    }
  }
  

  function reset() {
    setBase64Img(null);
    setCameraOpen(false);
  }
  function retake() {
    setBase64Img(null);
    setCameraOpen(true);
  }
  if (!CameraPermission) {
    return alert("Please enable camera permissions");
  } else {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>
          {cameraOpen && !base64Img ? (
            <SafeAreaView style={styles.cameraContainer}>
              <Camera
                type={type}
                style={{ width: "100%", height: "90%" }}
                ref={camRef}
                autoFocus={true}
              ></Camera>
              <Flex
                flexDir={"row"}
                justifyContent={"space-around"}
                alignItems={"center"}
                marginTop={2}
              >
                <TouchableOpacity onPress={openCamera}>
                  <AntDesign name="back" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}>
                  <Box
                    width={50}
                    height={50}
                    bgColor="gray.400"
                    borderRadius={25}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraType}>
                  <Entypo name="cycle" size={24} color="black" />
                </TouchableOpacity>
              </Flex>
            </SafeAreaView>
          ) : cameraOpen && base64Img ? (
            <SafeAreaView style={styles.cameraContainer}>
              <Image
                style={{
                  width: "100%",
                  height: "90%",
                }}
                source={{
                  uri: `data:image/png;base64,${base64Img}`,
                }}
              />
              <Flex
                flexDir={"row"}
                justifyContent={"space-around"}
                alignItems={"center"}
                marginTop={2}
              >
                <TouchableOpacity onPress={retake}>
                  <AntDesign name="back" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={uploadImage}>
                  <Feather name="upload" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={reset}>
                  <Feather name="trash-2" size={28} color="black" />
                </TouchableOpacity>
              </Flex>
            </SafeAreaView>
          ) : (
            <View>
              <TouchableOpacity onPress={openCamera}>
                <Text>Open Camera</Text>
              </TouchableOpacity>
              <StatusBar style="auto" />
            </View>
          )}
        </View>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
