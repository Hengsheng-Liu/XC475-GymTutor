import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router"; // Removed Stack import, as it's not used
import { useAuth } from "../../Context/AuthContext";
import Logo from "../../assets/images/filledSpotMeLogo.svg";
import Logo2 from "../../assets/images/unfilledSpotMeLogo.svg";
import ChatLogo from "../../assets/images/filledChatLogo.svg";
import ChatLogo2 from "../../assets/images/unfilledChatLogo.svg";
import ProfileLogo from "../../assets/images/filledProfileLogo.svg";
import ProfileLogo2 from "../../assets/images/unfilledProfileLogo.svg";
import LeaderBoardLogo from "../../assets/images/LeaderBoardLogo.svg";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size: number;
  focused: boolean;
}) {
  const {focused, ...rest} = props;
  return <FontAwesome {...props}/>;
}

export default function TabLayout() {
  const { User, currUser } = useAuth(); 
  if (!User || !currUser) {
    return <Redirect href="/LogIn" />;
  } else {
    return (
      <Tabs
      initialRouteName="my-child" backBehavior="history"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#A5A5A5",
        tabBarStyle: { height: 80, paddingBottom:5}
      }}
      >
        <Tabs.Screen
          name="(MessagePage)"
          options={{
            href:"/MessageList",
            title: "",
            headerShown: false,
            tabBarIcon: ({focused, ...props}) => (focused ? 
              <ChatLogo width="40" height="40" scale="100%" {...props}/> : 
              <ChatLogo2 width="40" height="40" scale="100%" {...props}/>),      
          }}
          
        />
        <Tabs.Screen
          name="(HomePage)"
          options={{
            href: (currUser.gym === "" || currUser.gymId === "") ? "/" : "/Home" , // Check if this helped. It blinks from one page to the other when it doesn't have a gym
            // href:"/Home", use this if not working
            title: "",
            headerShown: false,
            tabBarIcon: ({focused, ...props}) => (focused ? 
              <Logo width="40" height="40" scale="100%" {...props}/> : 
              <Logo2 width="40" height="40" scale="100%" {...props}/>),
            }}
        />
        <Tabs.Screen
          name="(ProfilePage)"
          options={{
            href:"/ProfilePage",
            title: "",
            headerShown: false,
            tabBarIcon: ({focused, ...props}) => (focused ? 
              <ProfileLogo width="40" height="40" scale="100%" {...props}/> : 
              <ProfileLogo2 width="40" height="40" scale="100%" {...props}/>),
            }}
        />
        <Tabs.Screen
          name="(LeaderBoardPage)"
          options={{
            href:"/LeaderBoard",
            title: "",
            headerShown: false,
            tabBarIcon: ({focused, ...props}) => (
              <LeaderBoardLogo width="40" height="40" scale="100%" {...props}/>
            )
          }}></Tabs.Screen>
      </Tabs>


    );
  }
}
