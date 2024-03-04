import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService';
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

type Props = {
  navigation: StackNavigationProp<any>;
};

const ChatPage: React.FC<Props> = ({ navigation }) => {

  const { User } = useAuth();
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status


  if (!User) return; // Check if user is null
  return (
    <View>
      <Text>Chat with user</Text>
      {/* More UI elements */}
    </View>
  );
}

export default ChatPage;