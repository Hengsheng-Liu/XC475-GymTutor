import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUsers, IUser, updateUsers } from '@/components/FirebaseDataService';
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { styles } from '../../../components/DisplayUsersStyles';
import { router } from "expo-router";

type Props = {
  navigation: StackNavigationProp<any>;
};


const MessageList: React.FC<Props> = ({ navigation }) => {

  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [gym, setGym] = useState<string>(''); // State to store the gym input
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const { User } = useAuth();

  if (!User) return;

  // TODO: Display user preview when clicked
  const handleUserClick = (user: IUser) => {
    // Do something when user is clicked
    // Open Profile
  };



  let content = null;
  if (User) {
    content = (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled" // Ensures taps outside of text inputs dismiss the keyboard
        keyboardDismissMode="on-drag" // Dismisses the keyboard when dragging the ScrollView
      >
        <TextInput
          placeholder="Enter your gym"
          value={gym}
          onChangeText={setGym}
          style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonSeparator} />
          <Button title="Friends List" onPress={() => router.push("/Friends")} />
          <View style={styles.buttonSeparator} />
          <Button title="Notification List" onPress={() => router.push("/Notifications")} />
        </View>
        <Text> Explore new users! </Text>
        {users.map((user, index) => (
          <TouchableOpacity key={index} style={styles.userContainer} onPress={() => handleUserClick(user)}>
            <View style={styles.profilePicture}></View>
            {/* Once we have an image, I can put this */}
            {/* <Image
                              source={{ uri: user.profilePictureURL }}
                              style={styles.profilePicture}
                          /> */}
            <View style={styles.userInfo}>
              <Text>Name: {user.name}</Text>
              <Text>Email: {user.email}</Text>
              <Text>Gym: {user.gym}</Text>
              <Text>UID: {user.uid}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
    );
  } else {
    content = <Text>No user signed in.</Text>;
  }

  return <View>{content}</View>;
};

export default MessageList;