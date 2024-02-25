import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="Friends"options= {{headerTitle: "My Friends"}}/>
        <Stack.Screen name="(tabs)" options= {{headerShown: false}}/>
        </Stack>
    )
}