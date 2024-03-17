import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import theme from '@/components/theme';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import FriendRequest from '../../../../components/FriendsComponents/RequestContainer';
import fetchUsers from '../../../../components/FriendsComponents/FetchUsers';
import { getCurrUser } from '@/components/FirebaseUserFunctions';
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

type Props = {
  navigation: StackNavigationProp<any>;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<IUser[]>([]); // State to store friends requests
  const {User} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  
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
    setLoading(true);
    const currUser = await getCurrUser(User.uid);
    if (!currUser) return;

    setRequests([]);
    try {
      const fetchedRequests = await fetchUsers(currUser, currUser.friendRequests);
      setRequests(fetchedRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
    }
    setLoading(false);
  };

  return (
    <NativeBaseProvider theme = {theme} >
      <SafeAreaView style= {{backgroundColor: "#FFF", flex:1, padding:15}}>
      <ScrollView >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : requests.length === 0 ? (
          <Text color= "trueGray.900" fontSize="md" >No Notifications</Text>
        ) : (
          <Flex p={1}>
            {requests.map((user) => (
              < FriendRequest friend= {user} key={user.uid}/>
            ))}
          </Flex>  
        )}
      </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>

)};

export default NotificationScreen;