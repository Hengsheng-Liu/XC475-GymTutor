import { Stack } from "expo-router"

export default function authLayout() {
    return (
        <Stack>
            <Stack.Screen name="ProfilePage" options={{ headerShown: false, title: "Profile" }} />
            <Stack.Screen name="AchievementPage" options={{ headerShown: false, title: "Your Badges" }} />
            <Stack.Screen name="Friends" options={{ headerShown: false }} />
            <Stack.Screen name="FriendProfile2" options={{ headerShown: false }} />
            <Stack.Screen name="PastPhoto" options={{ headerShown: false }} />
            <Stack.Screen name="FeedbackPage" options={{ headerShown: false }} />
        </Stack>
    )
}