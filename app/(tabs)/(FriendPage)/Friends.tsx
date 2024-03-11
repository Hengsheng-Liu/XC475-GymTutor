import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

import { NativeBaseProvider,extendTheme } from 'native-base';
import { Flex, Heading, Input, Row, Text, Box } from "native-base";


import { styles } from "@/components/NotificationsStyles"


type Props = {
  navigation: StackNavigationProp<any>;
};

const FriendListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = extendTheme({
    components:{
        Text:{
            baseStyle:{
                color: "#F0F9FF",
            }
        },
        Heading:{
            baseStyle:{
                color: "#F0F9FF",
            }
        },
    }
  });

  const [friends, setFriends] = useState<IUser[]>([]); // State to store friends' data
  const {User} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  
  if (!User) return; // Check if user is null

  // Refetch data when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchFriends();
    }
  }, [isFocused]);

  // Function to fetch friends
  const fetchFriends = async () => {
    const currUser = await getUser(User.uid);
    const fetchedFriends: IUser[] = [];

    if (!currUser) return; // Check if user is null

    setLoading(true);
    
    try {
        // Iterate over each friend UID
        for (const friendUID of currUser.friends) {
            // Fetch user data for the current friend UID
            const friendData = await getUser(friendUID);
            if (friendData !== null) {
              fetchedFriends.push(friendData);
          }
        }
        // Set the fetched friends array
        setFriends(fetchedFriends);
    } catch (error) {
        console.error('Error fetching friends:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <NativeBaseProvider theme = {theme}>
      <View>
        <Text style={styles.title}>Friends</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : friends.length === 0 ? (
          <Text>No friends. Try connecting with some users!</Text>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled" // Ensures taps outside of text inputs dismiss the keyboard
            keyboardDismissMode="on-drag" // Dismisses the keyboard when dragging the ScrollView
          >
            {friends.map((user, index) => (
              <TouchableOpacity key={index} style={styles.userContainer}>
                <View style={styles.profilePicture}></View>
                <View style={styles.userInfo}>
                  <Text style={styles.nameStyle}>{user.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </NativeBaseProvider>
    
  );
};

const { width } = Dimensions.get('window');
const containerMargin = 20;
const friendContainerWidth = width - 2 * containerMargin;

const stylez = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendContainer: {
    width: friendContainerWidth,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  friendName: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default FriendListScreen;