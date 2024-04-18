import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseUserFunctions';
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { router } from "expo-router";
import { GiftedChat, Composer, Send } from 'react-native-gifted-chat';
import Fire from './data'
import { globalState } from './globalState';
import { generateChatId } from './data';

type Props = {
  navigation: StackNavigationProp<any>;
};


const ChatPage: React.FC<Props> = ({ navigation }) => {

  const { User } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status


  // Accessing the user parameter passed to this screen
  const receiveUser = globalState.user; // Using optional chaining in case params are undefined

  if (!User) {
    return null;
  }

  function renderMessage(props) {
    return (
      <View style={{
        maxWidth: '70%',
        margin: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: props.currentMessage.user._id === receiveUser.uid ? '#FED7AA' : '#F97316',
        alignSelf: props.currentMessage.user._id === receiveUser.uid ? 'flex-start' : 'flex-end',
      }}>
        <Text style={{ color: props.currentMessage.user._id === 1 ? '#fff' : '#000' }}>
          {props.currentMessage.text}
        </Text>
      </View>
    );
  }

  // Set style of the text input box
  function renderComposer(props) {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composer}
      />
    );
  }

  // Set style of the send button
  function renderSend(props) {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}
      >
        <View style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </View>
      </Send>
    );
  }

  // Logic to send a message
  const sendMessage = (messages = []) => {
    Fire.shared.send(messages, User.uid, receiveUser); // Use user.uid to send messages
    setMessage('');
  };


  useEffect(() => {

    const chatId = generateChatId(User.uid, receiveUser.uid);
    Fire.shared.on(chatId, message =>
      setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    );

    return () => {
      Fire.shared.off();
    };
  }, []);

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
    composer: {
      backgroundColor: '#F5F5F5',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0, // Adjust as necessary
      marginRight: 10, // Adjust as necessary
    },
    sendContainer: {
      justifyContent: 'center',
      height: 44,
      marginRight: 10, // Adjust as necessary
    },
    sendButton: {
      marginRight: 10,
      marginBottom: 5,
      borderWidth: 1, // Add a border
      borderColor: '#000000', // Border color matching the text color
      borderRadius: 15, // Rounded corners for the bubble effect
      paddingVertical: 5, // Vertical padding inside the bubble
      paddingHorizontal: 10, // Horizontal padding inside the bubble
      backgroundColor: 'white', // Background color for the bubble
    },
    sendText: {
      color: '#000000', // Customize the color
      fontWeight: 'bold',
      fontSize: 16
    },
  });

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.userName}>{receiveUser.name}</Text>
        <TouchableOpacity>
          {/* Icon for additional options */}
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => sendMessage(messages)}
        renderMessage={renderMessage}
        user={{
          _id: User.uid, // Use the UID from useAuth
          name: User.displayName || 'Anonymous', // Use the displayName from useAuth, if available
        }}
        alwaysShowSend={true}
        renderComposer={renderComposer}
        renderSend={renderSend}
      />
    </KeyboardAvoidingView>
  );
}



export default ChatPage;