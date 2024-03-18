import { Stack, Redirect, router } from "expo-router";
import { useAuth } from "../../../Context/AuthContext";
import {
  getUser,
  IUser,
  getCurrUser,
} from "../../../components/FirebaseUserFunctions";
import * as React from "react";
import { useEffect, useState } from "react";

export default function authLayout() {
  const { User } = useAuth();

  useEffect(() => {
    if (!User) return;
    const fetchUser = async () => {
      const user = await getCurrUser(User.uid);
      if (user?.gym && user?.gym.length > 0){
        router.navigate("/(tabs)/(HomePage)/Home");
        return;
      }else{
        router.navigate("/(tabs)/(GymPage)");
      }
    };
    fetchUser();
    
  }, [User]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(HomePage)" options={{ headerShown: false }} />
    </Stack>
  );
}
