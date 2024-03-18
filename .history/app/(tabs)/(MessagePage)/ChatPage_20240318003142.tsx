import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseUserFunctions';
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

type Props = {
  navigation: StackNavigationProp<any>;
};

const ChatPage: React.FC<Props> = ({ navigation }) => {

  const { User } = useAuth();
  const [message, setMessage] = useState('');
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const sendMessage = () => {
    // Logic to send message goes here
    setMessage('');
  };

  if (!User) return; // Check if user is null
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Icon for back navigation */}
        </TouchableOpacity>
        <Text>{User.displayName}</Text>
        <TouchableOpacity>
          {/* Icon for additional options */}
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Map through messages and create chat bubbles */}
      </ScrollView>
      <View>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatPage;