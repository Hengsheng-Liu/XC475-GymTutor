import { Stack } from "expo-router"
import MessageList from './MessageList';
import ChatPage from './ChatPage';

export default function authLayout() {
  return (
    <Stack>
      <Stack.Screen name="MessageList" />
      <Stack.Screen name="ChatPage" />

    </Stack>
  )
}

