import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CurrentlyMessagingEntry, IUser } from "@/components/FirebaseUserFunctions";
import { useAuth } from "@/Context/AuthContext";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { router } from "expo-router";
import { findOrCreateChat, generateChatId } from "./data";
import { globalState } from './globalState';
import { NativeBaseProvider, Spacer, Pressable, Text, Box, Column, Spinner, Heading, Input, Row } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/components/theme";
import Header from "@/components/ChatComponents/Header";
import { FontAwesome } from "@expo/vector-icons";
import { getDocs, where, query, collection, doc, deleteDoc, getDoc, updateDoc, arrayRemove, writeBatch, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { filterUsersByName } from "@/components/FirebaseUserFunctions";
import ChatPreview from "@/components/ChatComponents/ChatContainer";
import { FontAwesome5, Octicons } from '@expo/vector-icons';

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
  const [currentUserCurrentlyMessaging, setCurrentUserCurrentlyMessaging] = useState([]);
  const [deleteMessageTrigger, setDeleteMessageTrigger] = useState(0);


  useEffect(() => {

    if (!User.uid) return;  // Ensure that User.uid is available

    // Reference to the user's document in Firestore
    const currentUserDocRef = doc(firestore, "Users", User.uid);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(currentUserDocRef, (doc) => {
      const userData = doc.data();
      const CurrentlyMessagingData = userData?.CurrentlyMessaging;

      // Update state with the latest data
      setCurrentUserCurrentlyMessaging(CurrentlyMessagingData);

      setFirstLoad(false);

      // Optionally, log the timeAsNumber for debugging
      if (CurrentlyMessagingData) {
        console.log(CurrentlyMessagingData.map(entry => entry.timeAsNumber));
      }
    }, (error) => {
      console.error("Failed to fetch user data:", error);
    });

    // Clean up the listener when the component unmounts or User.uid changes
    return () => unsubscribe();
  }, [User.uid, firestore]);


  useEffect(() => {
    // Only execute handleSearchUsers if:
    // - The screen is focused, and
    // - It is not the first load, or
    // - The first load has just completed and this is a subsequent update.
    if (isFocused && !firstLoad) {
      handleSearchUsers();
    }
  }, [isFocused, firstLoad, deleteMessageTrigger]); // Depend on both isFocused and firstLoad

  // Search currently messaged users
  const handleSearchUsers = async () => {

    if (firstLoad) {
      return;
    }
    if (currUser) {
      setUsers([]);
      setLoading(true);

      let messagedUsers: CurrentlyMessagingEntry[] = []
      let db = firestore;

      // You can use the currentlyMessaging field from the user
      // You might need to save them into context if you save new ones
      // For now I save them in your generateChatId function check it out and see how you would need to modify it
      messagedUsers = currentUserCurrentlyMessaging;

      // For now, I'll show all users if there are no users on the currentlyMessaging. 
      // Hardcode a couple for testing and then you should remove this option
      // Extract user IDs from the messagedUsers array of tuples
      const userIds = messagedUsers.map(entry => entry.userId);

      let usersQuery = userIds.length > 0 ?
        query(collection(db, 'Users'), where('uid', 'in', userIds)) :
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

      // Sort the users based on the timeAsNumber, descending (most recent first)
      const sortedUsers = usersData.sort((a, b) => {
        // Find the corresponding timeAsNumber for each user
        const timeAsNumberA = messagedUsers.find(entry => entry.userId === a.uid)?.timeAsNumber ?? 0;
        const timeAsNumberB = messagedUsers.find(entry => entry.userId === b.uid)?.timeAsNumber ?? 0;
        return timeAsNumberB - timeAsNumberA; // Sort in descending order
      });


      // Filter list of users by name if provided
      if (searchTerm && searchTerm !== "" && usersData.length > 0) {
        if (searchTerm !== "all") {
          setUsers(filterUsersByName(sortedUsers, searchTerm));
        } else {
          setUsers(sortedUsers);
        }
      } else {
        setUsers(sortedUsers);
      };
      setLoading(false);
    };
    console.log(users.map(entry => entry.name));
  };

  const FriendHeader = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    return (
      <Row
        mb={2}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Column>
          <Heading size="md" color="trueGray.900" > Message</Heading>
          <Text> Keep in touch with your friends</Text>
          <Spacer />
        </Column>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("./FriendsChatCopy")} >
          <Image
            source={require('../../../assets/images/Vector.png')}
          />
        </TouchableOpacity>
      </Row>
    );
  };

  const navigateToChatPage = (user) => {
    console.log(findOrCreateChat(User?.uid, user.uid));
    globalState.user = user; // Set the selected user in the global state
    router.navigate("ChatPage"); // Then navigate to ChatPage
  };

  const confirmAndDelete = (user) => {
    Alert.alert(
      "Confirm Delete", // Dialog Title
      "Are you sure you want to delete this chat?", // Dialog Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleDeleteMessageSession(user),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteMessageSession = async (user) => {
    setLoading(true);
    try {
      if (!User || !User.uid) {
        console.error("No current user logged in!");
        return;
      }

      // Generate the chat document ID using your existing function
      const chatId = generateChatId(User.uid, user.uid);

      // Fetch current user document to get the timeAsNumber
      const currentUserDocRef = doc(firestore, "Users", User.uid);

      // Fetch other user document to get the timeAsNumber
      const otherUserDocRef = doc(firestore, "Users", user.uid);
      const otherUserDoc = await getDoc(otherUserDocRef);
      const otherUserData = otherUserDoc.data();

      const currentUserEntryToRemove = currentUserCurrentlyMessaging.find(entry => entry.userId === user.uid);
      const otherUserEntryToRemove = otherUserData?.CurrentlyMessaging.find(entry => entry.userId === User.uid);

      // Create a reference to the chat document
      const chatDocRef = doc(firestore, "Chat", chatId);
      const messagesColRef = collection(chatDocRef, "Messages");

      // First, delete all documents in the Messages subcollection
      const messagesSnapshot = await getDocs(messagesColRef);
      const batch = writeBatch(firestore);

      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();
      console.log("All messages deleted successfully");

      // Delete the chat document
      await deleteDoc(chatDocRef);

      console.log(chatDocRef);

      console.log("Chat session deleted successfully");

      if (currentUserEntryToRemove && otherUserEntryToRemove) {
        await updateDoc(currentUserDocRef, {
          CurrentlyMessaging: arrayRemove(currentUserEntryToRemove)
        });
        await updateDoc(otherUserDocRef, {
          CurrentlyMessaging: arrayRemove(otherUserEntryToRemove)
        });

        console.log("Both users' CurrentlyMessaging fields updated successfully");
      }

      // Change the state variable so that search function is triggered to show the change
      setDeleteMessageTrigger(prev => prev + 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to delete chat session:", error);
    }
  };

  // Based on haveRead field in CurrentlyMessaging, determine the background color of chat records
  const getBackgroundColor = (user) => {

    // Find the messaging entry for the given user
    const messagingEntry = currentUserCurrentlyMessaging.find(entry => entry.userId === user.uid);
    // If haveRead is false, return the gray color, otherwise return the default
    return messagingEntry && !messagingEntry.haveRead ? "coolGray.400" : "#FAFAFA";
  };

  // Checks if there are unread messages for the user
  const hasUnreadMessages = (user) => {
    const messagingEntry = currentUserCurrentlyMessaging.find(entry => entry.userId === user.uid);
    return messagingEntry && !messagingEntry.haveRead;
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 15 }}
      >
        <FriendHeader />
        <Row mb={1} space={2} alignItems="center">
          <Input flex={1}
            InputLeftElement={
              <Box paddingLeft={2}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleSearchUsers} >
                  <FontAwesome name="search" size={24} color="#A3A3A3" />
                </TouchableOpacity>
              </Box>
            }
            placeholder="Type and look for your partner"
            bgColor="trueGray.100"
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchUsers}
            borderRadius="md"
            borderWidth={1}
            fontSize="md"
          />
        </Row>
        {loading &&
          <Column flex={1} alignItems="center" alignContent="center" justifyContent="center">
            <Spacer />
            <Spinner size="md" mb={2} color="#0284C7" accessibilityLabel="Loading posts" />
            <Heading color="#0284C7" fontSize="md"> Loading</Heading>
          </Column>}
        {!firstLoad && !loading && users.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              No current chats found. 🤔
            </Text>
            < Text />
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              Try connecting with some people!
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1, zIndex: 0 }}>
            {users.map((user) => (
              <Pressable onPress={() => navigateToChatPage(user)} onLongPress={() => confirmAndDelete(user)}>
                {({ isPressed }) => (
                  <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"} // Static background color
                    borderWidth="1px"
                    borderColor="gray.300"
                    position="relative" // Needed to position the dot absolutely within the box
                    p="0" // Add some padding inside the box
                  >
                    <ChatPreview friend={user} key={user.uid} />
                    {hasUnreadMessages(user) && (
                      <Box // Blue dot indicator
                        position="absolute"
                        right="4" // Positioning it to the right inside the box
                        top="50%" // Vertically center

                        size="12px" // Size of the dot
                        bg="blue.500" // The color of the dot
                        borderRadius="full" // Makes the box a circle
                      />
                    )}
                  </Box>
                )}
              </Pressable>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default MessageList;
