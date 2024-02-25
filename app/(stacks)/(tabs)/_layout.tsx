import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router'; // Removed Stack import, as it's not used

import { useAuth } from '../../../Context/AuthContext';

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
        />  
      <Tabs.Screen
        name="Home"
      />  
    </Tabs>
    );
  }
}
