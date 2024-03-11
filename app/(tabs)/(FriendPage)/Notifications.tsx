import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import FriendRequest from './FriendsComponents/FriendRequest';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import theme from '@/components/theme';
import fetchUsers from './FriendsComponents/FetchFriends';


type Props = {
  navigation: StackNavigationProp<any>;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<IUser[]>([]); // State to store friends requests
  const {currUser} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  
  if (!currUser) return; // Check if user is null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedRequests = await fetchUsers(currUser, currUser.friendRequests);
        setRequests(fetchedRequests);
      } catch (error) {
          console.error('Error fetching friend requests:', error);
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
        ) : requests.length === 0 ? (
          <Text>No Notifications</Text>
        ) : (
          <Flex>
            {requests.map((user) => (
              < FriendRequest friend= {user}/>
            ))}
          </Flex>  
        )}
      </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>

)};

export default NotificationScreen;