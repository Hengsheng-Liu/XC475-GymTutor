import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUser, IUser } from '@/components/FirebaseDataService'; 
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { addFriend, removeFriendRequest, rejectRequest } from '@/components/HandleFriends'
import FriendRequest from './FriendsComponents/FriendRequest';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";

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
        ) : requests.length === 0 ? (
          <Text>No Notifications</Text>
        ) : (
          <Flex>
            {requests.map((user, index) => (
              < FriendRequest key={index} friend= {user} index={index}/>
            ))}
          </Flex>  
        )}
      </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>

)};

export default NotificationScreen;