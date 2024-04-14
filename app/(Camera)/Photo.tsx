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
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { firestore } from '../../firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";
export default function photo() {
  let camRef = useRef<Camera>(null);
  const [type, setType] = useState(CameraType.back);
  const [pickImage, setPickImage] = useState(false);
  const {Avatar} = useLocalSearchParams();
  const { User } = useAuth();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [base64Img, setBase64Img] = useState<string | undefined>(undefined);
  useEffect(() => {
    console.log("Camerage Page again")
    reset();
  }, []);
  async function UserpickImage() {
    try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setBase64Img(result.assets[0].uri);
      setPickImage(true);
    }
  } catch (e) {
    console.log(e);
  }
}
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
  async function setUserIcon(url:string){
    if(User){
      const userRef = doc(firestore, "Users", User.uid);
      await updateDoc(userRef, { icon: url });
    }
}
  async function uploadImage() {
    try {
      const storage = getStorage();
      const url = Avatar ? `Icon/${User?.uid}/Avatar.png`:`CheckIn/${User?.uid}/${new Date().toISOString()}.png`;
      const storageRef = ref(
        storage,
        url
      );
      if(!base64Img){
        return
      }
      const fetchResponse = await fetch(`data:image/png;base64,${base64Img}`);

      const blob = await fetchResponse.blob();
  
      const uploadResult = await uploadBytes(storageRef, blob);
      if(Avatar){
        setUserIcon(url);
      }
      console.log("Image uploaded to: ", uploadResult.metadata.fullPath);
      if (uploadResult.metadata.fullPath) {
        alert("Image uploaded successfully!");
        reset();
      
      }
      Goback(url);
    } catch (error) {
      console.error("Error uploading image:", error);

    }
  }
  

  function reset() {
    setBase64Img(undefined);
    setCameraOpen(true);
    setPickImage(false);
  }
  function Goback(url?:string){
    if(Avatar){
      router.replace("ProfilePage");
    }else{
      if(url){
        router.replace({pathname:"/SelectWorkout",params:{url:url}});
      } else {
        router.replace("DailyPicture");
      }
    }
    reset();
  }
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
                {
                  /*
                <TouchableOpacity onPress={() => router.replace("ProfilePage")}>
                  <AntDesign name="back" size={28} color="black" />
                </TouchableOpacity>
                */}
                <TouchableOpacity onPress={UserpickImage} >
                    <FontAwesome name="photo" size={26} color="#EA580C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}>
                  <Box
                    width={50}
                    height={50}
                    bgColor="#EA580C"
                    zIndex={1}
                    borderRadius={25}
                    borderColor={"#FAFAFA"}
                    borderWidth={5}
                  />
                  <Box
                    width={60}
                    height={60}
                    marginTop={"-55"}
                    marginLeft={"-5.5"}
                    bgColor="#EA580C"
                    borderRadius={30}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraType}>
                  <Entypo name="cycle" size={26} color="#EA580C" />
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
                  uri: pickImage ?  base64Img : `data:image/png;base64,${base64Img}`
                }}
              />
              <Flex
                flexDir={"row"}
                justifyContent={"space-around"}
                alignItems={"center"}
                marginTop={2}
              >
                <TouchableOpacity onPress={reset}>
                  <AntDesign name="back" size={30} color="#EA580C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={uploadImage}>
                  <Feather name="upload" size={30} color="#EA580C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Goback()}>
                  <Feather name="trash-2" size={30} color="#EA580C" />
                </TouchableOpacity>
              </Flex>
            </SafeAreaView>
          ) : (
            <View>
            </View>
          )}
        </View>
      </NativeBaseProvider>
    );
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
