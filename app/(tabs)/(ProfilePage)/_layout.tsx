import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Profile" options= {{headerShown: true}}/>
        
        </Stack>
    )
}