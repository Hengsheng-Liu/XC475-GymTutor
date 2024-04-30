import React, { Component, useEffect, useState } from "react";
import { firestore, auth } from "../../../firebaseConfig";
import {
  limit,
  where,
  query,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  Query,
  onSnapshot,
  arrayRemove
} from "firebase/firestore";
import { useAuth } from "../../../Context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import {
  Box,
  Button,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Spacer,
  Tag,
  extendTheme,
  Flex,
  Popover,
  Text,
  Heading,
} from "native-base";
import Header from "../../../components/ProfileComponents/Header";
import ButtonGroup from "../../../components/ProfileComponents/ButtonGroup";
import Description from "../../../components/ProfileComponents/Description";
import Achievement from "../../../components/ProfileComponents/Achievement";
import Attribute from "../../../components/ProfileComponents/Attribute";
import History from "../../../components/ProfileComponents/History";
import {
  getUser,
  IUser,
  getCurrUser,
} from "../../../components/FirebaseUserFunctions";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import { router } from "expo-router";
// note - I originally wrote everything below in UserProfilePage.tsx under 'components', and tried importing
// it from there, but for some reason that didn't work. So for now, I put the code in UserProfilePage in this file

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<IUser>();
  const { User, userGym } = useAuth(); // gets current user's authentication data (in particular UID)
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => {
    if (!User) return;
    const fetchUser = async () => {
      const unsub = onSnapshot(
        doc(firestore, "Users", User.uid),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as IUser;
            setUserInfo(data);
            setHistory(data.checkInHistory.map((x) => x.day));
          } else {
            console.log("No user data available");
          }
        }
      );
      return () => unsub();
    };

    fetchUser();
  }, [User]);

  const updateBio = async (newBio: string) => {
    if (User) {
      try {
        await updateDoc(doc(firestore, "Users", User.uid), { bio: newBio });
      } catch (error) {
        console.error("Error updating bio: ", error);
      }
    }
  };
const signOutUser = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const updateTags = async (addTag: string) => {
    if (User) {
      try {
        await updateDoc(doc(firestore, "Users", User.uid), {
          tags: arrayUnion(addTag),
        });
      } catch (error) {
        console.error("Error updating tag: ", error);
      }
    }
  };
  const NewBackground = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        router.replace({
          pathname: "/Photo",
          params: { pictureType: "Background" },
        });
      } else {
        alert("Please allow camera permissions to continue.");
      }
    } catch (e) {
      console.log("Error fetching camera permissions:", e);
    }
  };
  const deleteTags = async (deleteTag: string)=>  {

    if (User) {
      try {
        await updateDoc(doc(firestore, "Users", User.uid), {
          tags: arrayRemove(deleteTag),
        });
      } catch (error) {

      }
    }
  }

  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          color: "#0369A1",
          rounded: "full",
        },
      },
      Text: {},
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={{ backgroundColor: "#FFF" }}>
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Flex alignSelf={"flex-end"}>
            <Popover
              placement="bottom"
              trigger={(triggerProps) => {
                return (
                  <Flex alignItems="center">
                    <Button mb={1} mr={2.5} p={0} bgColor={"#FFF"} _pressed={{opacity:0.5}}{...triggerProps}>
                      <Text fontSize="xl">三</Text>
                    </Button>
                  </Flex>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <Pressable onPress={() => NewBackground()} mb={1} _pressed={{opacity:0.5}}>
                    <Text>Edit Background</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push({pathname:"/AchievementPage",params:{edit:true,display:userInfo?.display}})} _pressed={{opacity:0.5}}>
                    <Text>Edit Achievements</Text>
                  </Pressable>
                  <Pressable onPress={signOutUser}  _pressed={{opacity:0.5}}>                  
                  <Text>Logout</Text>
                  </Pressable>

              </Popover.Body>
            </Popover.Content>
          </Popover>
        </Flex>
          <Box>
            {userInfo && (
              <Flex>
                <Header
                  name={userInfo.name}
                  gym={userInfo.gym}
                  icon={userInfo.icon}
                  background={userInfo.background}
                  />
                  <Box ml={"3"} mr={"3"}>
                    <Attribute
                      description={userInfo.tags}
                      onSaveTag={updateTags}
                      onDeleteTag={deleteTags}
                    />
                    <ButtonGroup
                  friendCount={userInfo.friends.length + (userInfo.friends.length == 1 ? " Friend" : " Friends")}
                  gym={userGym}
                  History={history}
                />
                <Description bio={userInfo.bio} onSave={updateBio} />
                <Achievement display={userInfo.display} />
                <History history={userInfo.checkInHistory} />               
                </Box>              
              </Flex>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default ProfilePage;
