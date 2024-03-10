import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider,extendTheme } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import Friend from './FriendsComponents/Friend'


export default function FriendListScreen () {
  const [friends, setFriends] = useState<IUser[]>([]); // State to store friends' data
  const {currUser} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  
  if (!currUser) return; // Check if user is null

  // Function to fetch friends
  const fetchFriends = async () => {
    const fetchedFriends: IUser[] = [];

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

  const theme = extendTheme({

    components:{
        Text:{
            baseStyle:{
                color: "#171717",
            },
        },
        Heading:{
            baseStyle:{
                color: "#171717",
                
            }
        },
    }
  });
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
            {friends.map((user, index) => (
              < Friend friend= {user}/>
            ))}
          </Flex>  
        )}
      </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>
    
  );
};

