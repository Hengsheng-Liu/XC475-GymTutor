import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Home" options= {{headerShown: true}}/>
        <Stack.Screen name="Friends" options= {{headerTitle: "My Friends"}}/>
        
        </Stack>
    )
}