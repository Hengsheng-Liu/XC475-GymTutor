import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import Friend from './FriendsComponents/Friend';
import fetchUsers from './FriendsComponents/FetchFriends';
import theme from '@/components/theme';

export default function FriendListScreen () {
  const [friends, setFriends] = useState<IUser[]>([]);
  const {currUser} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true);
  
  if (!currUser) return; // Check if user is null

  useEffect(() => {
    const fetchData = async () => {
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
    
    fetchData();
  }, [currUser]);

  return (
    <NativeBaseProvider theme = {theme} >
      <ScrollView style= {{backgroundColor: "#FFF", flex:1}}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : friends.length === 0 ? (
          <Text>No friends. Try connecting with some users!</Text>
        ) : (
          <Flex>
            {friends.map((user) => (
              < Friend friend = {user} key={user.uid}/>
            ))}
          </Flex>  
        )}
      </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>
  );
};

