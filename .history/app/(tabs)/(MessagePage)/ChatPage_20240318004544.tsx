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

  const [message, setMessage] = useState('');
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const sendMessage = () => {
    // Logic to send message goes here
    setMessage('');
  };

  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    userName: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    chatContainer: {
      flex: 1,
      padding: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      borderColor: 'gray',
      backgroundColor: '#ffffff',
    },
    sendButton: {
      marginLeft: 10,
      fontSize: 16,
      color: '#007bff',
    },
    messageBubble: {
      padding: 10,
      borderRadius: 20,
      marginVertical: 5,
    },
    incomingMessage: {
      backgroundColor: '#e5e5ea',
      alignSelf: 'flex-start',
    },
    outgoingMessage: {
      backgroundColor: '#0b93f6',
      alignSelf: 'flex-end',
      color: '#fff',
    },
    profilePicture: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#dedede',
    },
    userInfo: {
      marginLeft: 10,
    },
  });

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Icon for back navigation */}
        </TouchableOpacity>
        <Text style={styles.userName}>Bob</Text>
        <TouchableOpacity>
          {/* Icon for additional options */}
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.chatContainer}>
        {/* Map through messages and create chat bubbles */}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatPage;