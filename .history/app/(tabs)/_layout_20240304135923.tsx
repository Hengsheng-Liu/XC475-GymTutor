import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router'; // Removed Stack import, as it's not used

import { useAuth } from "../../Context/AuthContext";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { User } = useAuth(); // Changed User to user
  if (!User) {
    return <Redirect href="/LogIn" />;
  } else {
    return (
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: (props) => <TabBarIcon {...props} name="home" />,
          }}
        />
        <Tabs.Screen
          name="(FriendPage)"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(MapPage)"
          options={{
            title: "Map",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(ProfilePage)"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(MessagePage)"
          options={{
            title: "MessageList",
            headerShown: false,
          }}
        />
      </Tabs>
    );
  }
}
