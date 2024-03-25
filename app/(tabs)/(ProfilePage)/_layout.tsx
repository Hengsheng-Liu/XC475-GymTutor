import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="ProfilePage" options= {{headerShown: false}}/>
        <Stack.Screen name="AchievementPage" options= {{headerShown: false}}/>
        </Stack>
    )
}