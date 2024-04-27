import { Stack } from "expo-router"
import MessageList from './MessageList';
import ChatPage from './ChatPage';

export default function authLayout() {
  return (
    <Stack>
      <Stack.Screen name="MessageList" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="ChatPage" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="FriendsChatCopy" options={{ headerShown: false, title: "Friends" }} />

    </Stack>
  )
}

