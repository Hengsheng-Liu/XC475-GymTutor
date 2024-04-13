import { Stack } from "expo-router"

export default function HomeLayout() {
    return(
        <Stack>
        <Stack.Screen name="Home" options= {{headerShown: false}}/>        
        <Stack.Screen name="Notifications" options= {{headerShown: false}}/>
        <Stack.Screen name="Filter" options= {{headerShown: false}}/>
        <Stack.Screen name="index" options= {{headerShown: false}}/>
        <Stack.Screen name="CheckIn" options= {{headerShown: false}}/>
        <Stack.Screen name="SelectWorkout" options= {{headerShown: false}}/>
        <Stack.Screen name="CheckInSubmit" options= {{headerShown: false}}/>
        <Stack.Screen name="FriendProfile" options= {{headerShown: false}}/>
        <Stack.Screen name="DailyPicture" options= {{headerShown: false}}/>
        </Stack>
    )
}