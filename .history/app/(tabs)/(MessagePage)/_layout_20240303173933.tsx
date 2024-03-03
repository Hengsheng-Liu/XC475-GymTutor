import { Stack } from "expo-router"

export default function authLayout() {
  return (
    <Stack>
      <Stack.Screen name="Message" options={{ headerShown: true }} />


    </Stack>
  )
}