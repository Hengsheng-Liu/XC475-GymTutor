import { Stack } from "expo-router"

export default function CameraLayout() {
    return(
        <Stack>
        <Stack.Screen name = "CheckIn" options = {{headerShown: false}}/>
        <Stack.Screen name = "CheckInSubmit" options = {{headerShown: false}}/>
        <Stack.Screen name = "SelectWorkout" options = {{headerShown: false}}/>
        <Stack.Screen name = "DailyPicture" options = {{headerShown: false}}/>
        </Stack>
    )
}