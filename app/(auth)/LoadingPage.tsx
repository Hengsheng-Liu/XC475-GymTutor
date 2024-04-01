import React, { useEffect } from "react";
import { Spinner, Heading, NativeBaseProvider} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthContext";
import { router } from "expo-router";

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
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0284C7"}}>
              <Spinner size="md" mb={2} color="#FFF" accessibilityLabel="Loading posts" />
              <Heading color="#FFF" fontSize="md"> Loading</Heading>
            </SafeAreaView>
          </NativeBaseProvider>
        );
      }

};
