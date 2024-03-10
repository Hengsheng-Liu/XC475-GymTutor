import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { NativeBaseProvider,extendTheme } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import Friend from './FriendsComponents/Friend'


export default function FriendListScreen () {
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
              < Friend key={index} friend= {user} index={index}/>
            ))}
          </Flex>  
        )}
      </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>
    
  );
};

