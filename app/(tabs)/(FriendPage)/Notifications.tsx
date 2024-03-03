import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { addFriend, removeFriendRequest, rejectRequest } from '@/components/HandleFriends'

type Props = {
  navigation: StackNavigationProp<any>;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<IUser[]>([]); // State to store friends requests
  const {User} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  
  if (!User) return; // Check if user is null

  // Refetch data when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchRequests();
    }
  }, [isFocused]);

  // Function to fetch friends
  const fetchRequests = async () => {
    const currUser = await getUser(User.uid);
    const fetchedRequests: IUser[] = [];

    if (!currUser) return; // Check if user is null

    setLoading(true);
    
    try {
        // Iterate over each friend Request UID
        for (const RequestUID of currUser.friendRequests) {
            // Fetch user data for the current friend UID
            const RequestData = await getUser(RequestUID);
            if (RequestData !== null) {
              fetchedRequests.push(RequestData);
          }
        }
        // Set the fetched friends array
        setRequests(fetchedRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
    } finally {
        setLoading(false);
    }
  };

  // Function to accept friend request
  const acceptFriendRequest = async (friend: IUser) => {
    // Add friend to the user's friend list
    await addFriend(User.uid, friend.uid);
    // Remove friend request from user's friend requests list
    await removeFriendRequest(User.uid, friend.uid);
    // Refetch friend requests
    fetchRequests();
  };

  // Function to reject friend request
  const rejectFriendRequest = async (friend: IUser) => {
    // Remove friend request from user's friend requests list
    await removeFriendRequest(User.uid, friend.uid);

    await rejectRequest(User.uid, friend.uid);
    // Refetch friend requests
    fetchRequests();
  };

  // Render item component for FlatList
  const renderItem = ({ item }: { item: IUser }) => (
    <View style={styles.friendContainer}>
      <Text style={styles.friendName}>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => acceptFriendRequest(item)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => rejectFriendRequest(item)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : requests.length === 0 ? (
        <Text>No notifications</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  friendName: {
    fontSize: 18,
    marginLeft: 10,
  },
  friendEmail: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: 80,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
});

export default NotificationScreen;