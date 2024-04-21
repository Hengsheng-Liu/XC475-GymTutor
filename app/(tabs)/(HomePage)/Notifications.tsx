import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text, Column, Spacer, Spinner, Heading, Divider, Box} from "native-base";
import { FontAwesome } from '@expo/vector-icons';
import theme from '@/components/theme';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import FriendRequest from '../../../components/FriendsComponents/RequestContainer';
import fetchUsers from '../../../components/FriendsComponents/FetchUsers';
import { getCurrUser } from '@/components/FirebaseUserFunctions';
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { router } from 'expo-router';

type Props = {
  navigation: StackNavigationProp<any>;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<IUser[]>([]); // State to store friends requests
  const [pendingRequests, setPendingRequests] = useState<IUser[]>([]); // State to store pending friend requests
  const [historyRequests, setHistoryRequests] = useState<IUser[]>([]); // State to store history friend requests
  const [rejectedRequests, setRejectedRequests] = useState<IUser[]>([]); // State to store rejected friend requests
  const [acceptedRequests, setAcceptedRequests] = useState<IUser[]>([]); // State to store accepted friend requests
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
      const friendRequests = currUser.friendRequests;

      const pending = friendRequests.filter(request => request.status === 'pending');

      // Filter history requests to show only those within the last 30 days
      const currentDate = new Date().getTime();
      const thirtyDaysAgo = currentDate - (30 * 24 * 60 * 60 * 1000);

      const history = friendRequests.filter(request => request.date >= thirtyDaysAgo && request.status !== 'pending');

      const rejected = history.filter(request => request.status === 'rejected');
      const accepted = history.filter(request => request.status === 'accepted');

      const fetchHistory = await fetchUsers(currUser, history.map(request => request.friend));
      const fetchRejected = await fetchUsers(currUser, rejected.map(request => request.friend));
      const fetchAccepted = await fetchUsers(currUser, accepted.map(request => request.friend));
      const fetchPending = await fetchUsers(currUser, pending.map(request => request.friend));

      setPendingRequests(fetchPending);
      setHistoryRequests(fetchHistory);
      setRejectedRequests(fetchRejected);
      setAcceptedRequests(fetchAccepted);

    } catch (error) {
        console.error('Error fetching friend requests:', error);
    }
    setLoading(false);
  };

  // Handle navigation. 
  const handleGoBack = () => {
    router.replace("/Home");
  };

  return (
    <NativeBaseProvider theme = {theme} >
      <SafeAreaView style= {{backgroundColor:"#FFFFFF", flex:1, overflow: "hidden"}}>
        <Flex p={15} flexDirection={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => handleGoBack()}>
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Spacer/>
          <Box>
            <Heading fontSize="lg" color="trueGray.800" pr="2">Notifications</Heading> 
          </Box>
          <Spacer/>
          <Text fontSize="3xl">...</Text>
        </Flex>
      <ScrollView style= {{flex:1, backgroundColor:"#FFF", padding:15, paddingTop: 0}}>
        {loading && (
          <Column flex={1} flexDirection={"column"} padding={50} alignItems="center" alignContent="center" justifyContent="center">
            <Spacer/>
            <Spinner size="md" mb={2} color="#F97316" accessibilityLabel="Loading posts" />
            <Heading color="#F97316" fontSize="md"> Loading</Heading>
            <Spacer/>
          </Column>
        )} 
        {!loading && (
          <>
            <Text color="trueGray.900" fontSize="lg" fontWeight="bold">New Connections</Text>
            <Spacer/>
            <Divider my={2} />
              {pendingRequests.length >0 ? (
                <>
                  <Flex>
                    {pendingRequests.map((user) => (
                      <FriendRequest friend={user} key={user.uid} status={"pending"}/>
                    ))}
                  </Flex>
                </>
              ) : (
                <Box>  
                  <Text color="trueGray.900" fontSize="sm" >No new notifications!</Text>
                  <Text> </Text>
                </Box>
              )}
              <Text></Text>
              <Text></Text>
              <Divider my={2} />
              <Text></Text>
              <Text></Text>
              <Text color="trueGray.900" fontSize="lg" fontWeight="bold">Recent Notifications</Text>
              <Divider my={2} />
              {historyRequests.length > 0 ? (
                <>
                  <Flex>
                    {acceptedRequests.map((user) => (
                      <FriendRequest friend={user} key={user.uid} status={"accepted"}/>
                    ))}
                    {rejectedRequests.map((user) => (
                      <FriendRequest friend={user} key={user.uid} status={"rejected"}/>
                    ))}
                  </Flex>
                </>
              ) : (
                <Text color="trueGray.900" fontSize="sm">No recent notifications!</Text>
              )}
            </>
          )}
      </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>

)};

export default NotificationScreen;