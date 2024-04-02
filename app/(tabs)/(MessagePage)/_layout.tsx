import { Stack } from "expo-router"
import MessageList from './MessageList';
import ChatPage from './ChatPage';

export default function authLayout() {
  return (
    <Stack>
      <Stack.Screen name="MessageList" options= {{headerShown: false, title: ""}}/>
      <Stack.Screen name="ChatPage" options={{headerShown: true, title: ""}}/>
      <Stack.Screen name="FriendsChat" options={{headerShown: true, title: ""}}/>

    </Stack>
  )
}

