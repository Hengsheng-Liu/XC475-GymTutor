import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Home" options= {{headerShown: false, headerTitle: ""}}/>
        <Stack.Screen name="Friends" options= {{headerTitle: "My Friends"}}/>
        <Stack.Screen name="Notifications" options= {{headerTitle: "Notifications"}}/>
        
        </Stack>
    )
}