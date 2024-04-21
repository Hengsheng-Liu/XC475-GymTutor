import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider } from 'native-base';
import { Spacer, Spinner, Heading, Column, View, Box, Input, Row } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text} from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, updateDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { filterUsersByName } from '@/components/FirebaseUserFunctions';
import FriendContainer from '../../../components/FriendsComponents/FriendContainer';
import fetchUsers from '../../../components/FriendsComponents/FetchUsers';
import theme from '@/components/theme';
import { getCurrUser } from '@/components/FirebaseUserFunctions';

export default function FriendListScreen () {
  const [friends, setFriends] = useState<IUser[]>([]);
  const {User, currUser, updateCurrUser, friend, updateFriend} = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!User) return; // Check if user is null

  useEffect(() => {
    fetchData();

    // const userDocRef = doc(firestore, 'Users', User.uid);
    // const unsubscribe = onSnapshot(userDocRef, () => { // Set up listener for changes in user's document
    //   fetchData(); // Fetch data whenever the document changes
    // });

    // return () => unsubscribe();
  }, [User]);

  const fetchData = async () => {
    setFriends([]);
    setLoading(true);
    try {
      if (currUser){  
        const fetchedFriends = await fetchUsers(currUser, currUser.friends);
        setFriends(fetchedFriends);
      }
    } catch (error) {
        console.error('Error fetching friends:', error);
        // Handle error as needed, e.g., show an error message to the user
    }
    setLoading(false);
  };

  const searchFriends = async () => {
    // Filter list of users by name if provided
    setLoading(true);
    if (searchTerm && searchTerm !== "" && friends.length > 0) {
        setFriends(filterUsersByName(friends, searchTerm));
    } 
    setLoading(false);
    }

  const handleGoBack = () => {
    router.replace("/ProfilePage");
  };

  return (
    <NativeBaseProvider theme = {theme} >
      <SafeAreaView style= {{backgroundColor:"#FFFFFF", flex:1}}>
      <Box p={15} pb={2} alignItems="center" justifyContent="space-between">
            <Row alignItems={"center"}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleGoBack()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Spacer/>
              <Box>
                <Heading fontSize="lg" color="trueGray.800" pr="1">Friends</Heading> 
              </Box>
              <Spacer/>
              <Text fontSize="3xl">...</Text>
            </Row>
      </Box>
        <Row alignItems="center">
          <Input flex={1} marginX={4} mb={2}
            InputLeftElement={
              <Box paddingLeft={2}>
                <TouchableOpacity activeOpacity={0.7} onPress={searchFriends} >
                  <FontAwesome name="search" size={24} color="#0284C7" />
                </TouchableOpacity>
              </Box>
            }
            placeholder="Look for your friend here!"
            bgColor="trueGray.100"
            onChangeText={setSearchTerm}
            borderRadius="md"
            borderWidth={1}
            fontSize="md"
          />
        </Row>
      <ScrollView style={{backgroundColor:"#FFF"}}>
        {loading ? (
          <Column flex={1} alignItems="center" alignContent="center" justifyContent="center">
            <Spacer/>
            <Spinner size="md" mb={2} color="#0284C7" accessibilityLabel="Loading posts" />
            <Heading color="#0284C7" fontSize="md"> Loading</Heading>
          </Column>
        ) : friends.length === 0 ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center", paddingLeft:3, paddingRight:3}}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              Oops! It seems like there are no friends to display.
            </Text> 
            < Text/>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              Try exploring and discover more amazing users!
            </Text>   
          </View>
        ) : (
          <Flex p={1} pt={3} >
            {friends.map((user) => (
              <FriendContainer friend= {user} fetchData={fetchData} key={user.uid}/>
            ))}
          </Flex>  
        )}
      </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

