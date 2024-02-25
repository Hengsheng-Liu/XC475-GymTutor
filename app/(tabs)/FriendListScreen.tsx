import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

type Props = {
  navigation: StackNavigationProp<any>;
};

const FriendListScreen: React.FC<Props> = ({ navigation }) => {
  const [friends, setFriends] = useState<IUser[]>([]); // State to store friends' data
  const {User} = useAuth();
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const nav = useNavigation(); // Use useNavigation hook
  
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

  // Set the title of the screen using useNavigation hook
  useEffect(() => {
    nav.setOptions({
      title: 'My Friends', // Change the title here
    });
  }, [nav]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.uid} // Assuming each user's UID is unique
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.friendName}>{item.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const containerMargin = 20;
const friendContainerWidth = width - 2 * containerMargin;

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