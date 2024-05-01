import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions';
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text, Spacer, Box, Heading, Row, Input, Column, Spinner, View } from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import FriendContainer2 from '../../../components/FriendsComponents/FriendContainer2';
import fetchUsers from '../../../components/FriendsComponents/FetchUsers';
import theme from '@/components/theme';
import { getCurrUser } from '@/components/FirebaseUserFunctions';
import { router } from "expo-router";
import { filterUsersByName } from '@/components/FirebaseUserFunctions';

export default function FriendListScreen() {
  const [friends, setFriends] = useState<IUser[]>([]);
  const { User, updateCurrUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    updateCurrUser(currUser);
    if (!currUser) return;

    setLoading(true);
    setFriends([]);
    try {
      const fetchedFriends = await fetchUsers(currUser, currUser.friends);
      setFriends(fetchedFriends);
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
    }  else {
      fetchData();
    }
    setLoading(false);
    }


  return (
    <NativeBaseProvider theme={theme} >
      <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
        <Box padding={15} pb={5} alignItems="center" justifyContent="space-between">
              <Row alignItems={"center"} mt={1}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
                  <FontAwesome name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Spacer/>
                <Box>
                  <Heading fontSize="lg" color="trueGray.800">Friends</Heading> 
                </Box>
                <Spacer/>
                <TouchableOpacity>
                  <FontAwesome name="chevron-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Row>
        </Box>
        <Row alignItems="center">
          <Input flex={1} marginX={4} mb={2}
            InputLeftElement={
              <Box paddingLeft={2}>
                <TouchableOpacity activeOpacity={0.7} onPress={searchFriends} >
                  <FontAwesome name="search" size={24} color="#A3A3A3" />
                </TouchableOpacity>
              </Box>
            }
            placeholder="Look for your friend here!"
            bgColor="trueGray.100"
            onChangeText={setSearchTerm}
            onSubmitEditing={searchFriends}
            borderRadius="md"
            borderWidth={1}
            fontSize="md"
          />
        </Row>
        <ScrollView>
          {loading ? (
            <Column flex={1} mt={10} alignItems="center" alignContent="center" justifyContent="center">
            <Spacer/>
            <Spinner size="md" mb={2} color="#F97316" accessibilityLabel="Loading posts" />
            <Heading color="#F97316" fontSize="md"> Loading</Heading>
          </Column>
        ) : friends.length === 0 ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center", paddingLeft:3, paddingRight:3}}>
            <Text/>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#A3A3A3">
              Oops! It seems like there are no friends to display.
            </Text> 
            < Text/>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#A3A3A3">
              Try exploring and discover more amazing users!
            </Text>   
          </View>
        ) : (
          <Flex p={1} pt={3} >
            {friends.map((user) => (
              <FriendContainer2 friend= {user} fetchData={fetchData} key={user.uid}/>
            ))}
          </Flex>  
        )}
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

