import { Stack } from "expo-router"

export default function CameraLayout() {
    return(
        <Stack>
        <Stack.Screen name="Photo" options= {{headerShown: false}}/>
        </Stack>
    )
}