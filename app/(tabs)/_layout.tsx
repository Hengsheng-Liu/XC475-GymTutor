import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router"; // Removed Stack import, as it's not used
import { useAuth } from "../../Context/AuthContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
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
          name="(MessagePage)"
          options={{
            title: "Message",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="comments" />,
          }}
        />
        <Tabs.Screen
          name="(HomePage)"
          options={{
            title: "SpotMe",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="group" />,
          }}
        />
        <Tabs.Screen
          name="(ProfilePage)"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="user" />,
          }}
        />
        <Tabs.Screen
          name = "Test"
          options={{
            title: "Test",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="pencil" />
          }}
        />
        <Tabs.Screen
          name = "(CameraPage)/Photo"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>

    );
  }
}
