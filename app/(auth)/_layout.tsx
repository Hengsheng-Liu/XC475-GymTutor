import { Stack } from "expo-router"

export default function authLayout() {
    return(
        <Stack>
        
        <Stack.Screen name="LogIn" options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" options={{headerShown:false}}/>
        <Stack.Screen name="SignUp2" options={{headerShown:false}} />
        <Stack.Screen name="LoadingPage" options={{headerShown:false}} />
        </Stack>
    )
}