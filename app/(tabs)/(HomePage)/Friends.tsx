import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

import FriendContainer from './FriendsComponents/FriendContainer';
import fetchUsers from './FriendsComponents/FetchUsers';
import theme from '@/components/theme';
import { getCurrUser } from '@/components/FirebaseUserFunctions';

export default function FriendListScreen () {
  const [friends, setFriends] = useState<IUser[]>([]);
  const {User} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true);
  
  if (!User) return; // Check if user is null

  useEffect(() => {
    fetchData();

    const userDocRef = doc(firestore, 'Users', User.uid);
    const unsubscribe = onSnapshot(userDocRef, () => { // Set up listener for changes in user's document
      fetchData(); // Fetch data whenever the document changes
    });

    return () => unsubscribe();
  }, [User]);

  const fetchData = async () => {
      
    const currUser = await getCurrUser(User.uid);
    if (!currUser) return;

    setFriends([]);
    setLoading(true);
    try {
      const fetchedFriends = await fetchUsers(currUser, currUser.friends);
      setFriends(fetchedFriends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        // Handle error as needed, e.g., show an error message to the user
    }
    setLoading(false);
  };

  return (
    <NativeBaseProvider theme = {theme} >
      <SafeAreaView style= {{backgroundColor: "#FFF", flex:1, padding: 15}}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : friends.length === 0 ? (
          <Text>No friends. Try connecting with some users!</Text>
        ) : (
          <Flex p={1}>
            {friends.map((user) => (
              < FriendContainer friend= {user} key={user.uid}/>
            ))}
          </Flex>  
        )}
      </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

