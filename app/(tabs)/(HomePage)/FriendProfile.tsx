import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../../Context/AuthContext";
import { Box, NativeBaseProvider, ScrollView, extendTheme, Flex } from "native-base";
import Header from "../../../components/ProfileComponents/Header";
import ButtonGroup from "../../../components/ProfileComponents/ButtonGroup";
import Description from "../../../components/ProfileComponents/Description";
import Achievement from "../../../components/ProfileComponents/Achievement";
import Attribute from "../../../components/ProfileComponents/Attribute";
import Calendar from "../../../components/ProfileComponents/Calendar";
import { IUser } from "../../../components/FirebaseUserFunctions";
import { SafeAreaView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";



const FriendProfilePage = ({ route }: { route: { params: { user: IUser } } }) => {
  // const { user } = useLocalSearchParams();
  
  const [userInfo, setUserInfo] = useState<IUser | undefined>(route.params.user);
  const { User } = useAuth(); // gets current user's authentication data (in particular UID)

  const updateBio = async (newBio:string) => {

  };

  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          color: "#0369A1",
          rounded: "full",
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView >
        <ScrollView backgroundColor={"#FFFFFF"}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"}>
            {userInfo && (
              <Flex>
                <Header name={userInfo.name} gym={userInfo.gym} />

                <Attribute description={userInfo.tags} />
                <ButtonGroup />
                <Description bio={userInfo.bio} onSave={updateBio}/>
                <Achievement />
                <Calendar />
              </Flex>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default FriendProfilePage;
