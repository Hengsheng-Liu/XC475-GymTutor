import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        <Stack.Screen name="SelectGym" options= {{headerShown: false}}/>
        <Stack.Screen name="Gym" options= {{headerShown: false}}/>
        </Stack>
    )
}
