import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="ProfilePage" options= {{headerShown: false , title:"Profile"}}/>
        <Stack.Screen name="AchievementPage" options= {{headerShown: true,title:"Your Badges" }}/>
        <Stack.Screen name="Friends" options= {{headerTitle: "My Friends"}}/>
        </Stack>
    )
}