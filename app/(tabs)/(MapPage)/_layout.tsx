import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Map" options= {{headerShown: true}}/>
        
        
        </Stack>
    )
}