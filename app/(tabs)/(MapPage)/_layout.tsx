import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Location" options= {{headerShown: true}}/>
        
        
        </Stack>
    )
}