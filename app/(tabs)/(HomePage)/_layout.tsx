import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (

      <Stack>
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" options={{ headerShown: false }}/>
        <Stack.Screen name="Filter" options={{ headerShown: false }}/>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="FriendProfile" options={{ headerShown: false }}/>
        <Stack.Screen name="PastPhoto2" options={{ headerShown: false }}/>
      </Stack>
  );
}
