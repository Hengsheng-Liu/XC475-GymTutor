import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { IUser } from "@/components/FirebaseUserFunctions";
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { router } from "expo-router";
import { findOrCreateChat } from "./data";
import { globalState } from './globalState';
import { NativeBaseProvider, Spacer, Pressable, Text, Box, Column, Spinner, Heading, Input, Row } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/components/theme";
import Header from "@/components/ChatComponents/Header";
import { FontAwesome } from "@expo/vector-icons";
import { getDocs, where, query, collection } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { filterUsersByName } from "@/components/FirebaseUserFunctions";
import ChatPreview from "@/components/ChatComponents/ChatContainer";

type Props = {
  navigation: StackNavigationProp<any>;
};

const MessageList: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [firstLoad, setFirstLoad] = useState<boolean>(true); // State to track first load
  const { User, currUser } = useAuth();

  const navigateToChatPage = (user) => {
    console.log(findOrCreateChat(User?.uid, user.uid));
    globalState.user = user; // Set the selected user in the global state
    router.navigate("ChatPage"); // Then navigate to ChatPage
  };

  useEffect(() => {
    if (User) {
      handleSearchUsers();
      setFirstLoad(false);
    }
  }, []);

  // Search currently messaged users
  const handleSearchUsers = async () => {
    if (currUser) {
      setUsers([]);
      setLoading(true);
      
      let messagedUsers: string[] = [];
      let db = firestore;
      
      // You can use the currentlyMessaging field from the user
      // You might need to save them into context if you save new ones
      // For now I save them in your generateChatId function check it out and see how you would need to modify it
      messagedUsers = currUser.currentlyMessaging;

      // For now, I'll show all users if there are no users on the currentlyMessaging. 
      // Hardcode a couple for testing and then you should remove this option
      let usersQuery = messagedUsers.length > 0 ? 
            query(collection(db, 'Users'), where('uid', 'in', messagedUsers)):
            query(collection(db, 'Users'), where("gym", "!=", "")); // This option gets all users (a bit roundabout)

      // Testing trick. Search "all" to show all users
      if (searchTerm === "all") {
        usersQuery = query(collection(db, 'Users'), where("gym", "!=", ""));
      }
      // Get each user and save their data
      const querySnapshot = await getDocs(usersQuery);
      const usersData: IUser[] = [];

      // Save user data if it is not the current User
      querySnapshot.forEach(snap => {
          const userData = snap.data() as IUser;
          if (userData.uid !== currUser.uid) {
              usersData.push(userData);
          }
      });

      // Filter list of users by name if provided
      if (searchTerm && searchTerm !== "" && usersData.length > 0) {
          if (searchTerm !== "all") {
            setUsers(filterUsersByName(usersData, searchTerm));
          } else {
            setUsers(usersData);
          }
      } else {
        setUsers(usersData);
      };
      setLoading(false);
    };
  };

  return ( 
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 15}}
      >
        <Header />
        <Row mb={1} space={2} alignItems="center">
        <Input flex={1}
          InputLeftElement={
            <Box paddingLeft={2}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleSearchUsers} >
                <FontAwesome name="search" size={24} color="#0284C7" />
              </TouchableOpacity>
            </Box>
          }
          placeholder="Type and look for your partner"
          bgColor="trueGray.100"
          onChangeText={setSearchTerm}
          borderRadius="md"
          borderWidth={1}
          fontSize="md"
        />
        </Row>
        {loading && 
            <Column flex={1} alignItems="center" alignContent="center" justifyContent="center">
              <Spacer/>
              <Spinner size="md" mb={2} color="#0284C7" accessibilityLabel="Loading posts" />
              <Heading color="#0284C7" fontSize="md"> Loading</Heading>
            </Column>}
        {!firstLoad && !loading && users.length === 0 ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              No current chats found. 🤔
            </Text> 
            < Text/>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              Try connecting with some people!
            </Text>   
          </View>
          ) : (
          <ScrollView style={{flex:1, zIndex:0}}>
            {users.map((user) => (
            <Pressable onPress={()=> navigateToChatPage(user)}>
              {({ isPressed }) => {
              return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"} 
                          style={{transform: [{ scale: isPressed ? 0.96 : 1 }]}} 
                          shadow="3" borderRadius="xl" mb ={3} ml={1} mr={1} pr={1}>
                        <ChatPreview friend={user} key={user.uid} />
                      </Box>}}
            </Pressable>))}
          </ScrollView>
          )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default MessageList;
