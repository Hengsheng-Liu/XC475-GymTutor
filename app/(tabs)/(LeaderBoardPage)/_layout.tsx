import { Stack } from "expo-router";

export default function LeaderBoardPageLayout() {
  return (

      <Stack>
        <Stack.Screen name="LeaderBoard" options={{ headerShown: false }} />
      </Stack>
  );
}
