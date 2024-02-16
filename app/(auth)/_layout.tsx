import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        
        <Stack.Screen name="LogIn" />
        <Stack.Screen name="SignUp" />
        </Stack>
    )
}