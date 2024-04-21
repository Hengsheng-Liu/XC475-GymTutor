import React, { useEffect } from "react";
import { Spinner, Text, Heading, NativeBaseProvider, Spacer} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthContext";
import { router } from "expo-router";
import Logo from "../../assets/images/Logo.svg";

export default function LoadingScreen() {
    const { currUser, userFilters, userGym } = useAuth();

    useEffect(() => {
        if (currUser && userFilters && userGym) {
            if (currUser.gym === "" || currUser.gymId === "") {
              router.replace("/");
            } else{
              router.replace("/Home");
            } 
            }
      }, [currUser, userFilters, userGym]); // Check when user has been updated
    
       // Show loading screen while currUser is null
       if (!currUser || !userFilters || !userGym) {
        return (
          <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F97316"}}>
              <Logo width="200" height="200" scale="100%"/>
            </SafeAreaView>
          </NativeBaseProvider>
        );
      }

};
