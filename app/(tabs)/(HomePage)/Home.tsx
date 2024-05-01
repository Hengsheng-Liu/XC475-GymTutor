import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { NativeBaseProvider, Spacer, Pressable, Text, Box, Column, Spinner, Heading, Input, Row, Button } from "native-base";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
import { IUser, getUsers, updateUsers, removeFieldFromUsers, getCurrUser, Gym } from "@/components/FirebaseUserFunctions";
import UserPreview from "../../../components/HomeComponents/UserContainer";
import CheckedUserPreview from "../../../components/HomeComponents/CheckedUserContainer";
import Header from "../../../components/HomeComponents/Header";
import theme from "@/components/theme";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { GetUserLocation } from "@/components/GeolocationFunction";
import pointInPolygon from "point-in-polygon";
import { Octicons } from "@expo/vector-icons";
import { defaultFilters } from "./Filter";
import UserExpandedPreview from "@/components/HomeComponents/ExpandedPreview";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { CalendarUtils } from "react-native-calendars";
import { updateCurrentUser } from "firebase/auth";
//import { handleCheckIn } from "@/components/GeolocationFunction";
export default function HomeScreen() {
  // const [gym, setGym] = useState<Gym>(); // State to store the gym
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [checkedUsers, setCheckedUsers] = useState<IUser[]>([]); // State to store users that have a photo
  const [otherUsers, setOtherUsers] = useState<IUser[]>([]); // State to store the rest of the users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [firstLoad, setFirstLoad] = useState<boolean>(true); // State to track first load
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const { User, currUser, updateCurrUser, userGym } = useAuth();
  const [location, setLocation] = useState<number[]>([]);
  const bound = useRef<number[][]>([]); // State to store the gym boundary
  const [checkIn, setCheckIn] = useState<boolean>(false); // State to store the gym boundary
  const Day = new Date();
  const Today = CalendarUtils.getCalendarDateString(Day);


  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!User) return;

  // Initialize gym data
  useEffect(() => {
    if (!userGym || userGym[0] === "" || userGym[1] === "") {
      router.push("/");
    }
    if (currUser) {
      // updateUsers(); // Uncomment when we want to update users with new fields / random values
      handleSearchUsers();
      fetchGym();
      setFirstLoad(false);
      checkUser();
    };
  }, [isFocused]);

  const checkUser = () => {
    if (currUser) {
      const History = currUser.checkInHistory.map((each) => each.day);
      if (History && History.includes(Today)) {
        setCheckIn(true);
      };
    };
  };

  const fetchGym = async () => {
    if (userGym) {
      try {
        const gymDocRef = doc(firestore, "Gyms", userGym[0]);
        const userGym2 = (await getDoc(gymDocRef)).data() as Gym;

        userGym2.bounding.forEach((point) => {
          bound.current.push([point.latitude, point.longitude]);
        });
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Return') {
      // Perform the search operation
      handleSearchUsers();
    }
  };

  // Display user preview when clicked
  const handlePreviewClick = (friend: IUser) => {
    setSelectedUser(friend);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };

  // Search users by name
  const handleSearchUsers = async () => {
    if (currUser && userGym) {
      setUsers([]);
      setCheckedUsers([]);
      setOtherUsers([]);
      setLoading(true);

      const currUser2 = await getCurrUser(User.uid);
      updateCurrUser(currUser2);

      let fetchedUsers: IUser[];
      if (searchTerm === "") {
        //By default search users with filter and gym
        fetchedUsers = await getUsers(currUser.uid, userGym[0], currUser.filters);
        console.log("Fetched filtered users!");
      } else if (searchTerm === "all") {
        // Testing keyword to show all users
        fetchedUsers = await getUsers(currUser.uid);
        console.log("Fetched all users!");
      } else if (searchTerm === "all gym") {
        // Testing keyword to show all users on their gym
        fetchedUsers = await getUsers(currUser.uid, userGym[0], defaultFilters);
        console.log("Fetched all gym users!");
      } else {
        // Search by name
        fetchedUsers = await getUsers(currUser.uid, userGym[0], defaultFilters, searchTerm);
        console.log("Fetched users with name: ", searchTerm);
      }

      fetchedUsers = fetchedUsers.filter((user) => user.uid !== currUser.uid);
      fetchedUsers = fetchedUsers.filter((user) => !currUser2.blockedUsers.includes(user.uid));

      // Filter users that have checked in today
      const checkedUsers = fetchedUsers.filter((user) => {
        if (user.checkInHistory.length !== 0) {
          const lastCheckIn = user.checkInHistory[user.checkInHistory.length - 1];
          if (lastCheckIn && lastCheckIn.day && lastCheckIn.day === Today && lastCheckIn.photo) {
            return user;
          }
        }
        return;
      });
      console.log("Checked users: ", checkedUsers.map((user) => [user.name, user.checkInHistory[user.checkInHistory.length - 1].day]));
      setCheckedUsers(checkedUsers);
      const otherUsers = fetchedUsers.filter((user) => !checkedUsers.includes(user));
      setOtherUsers(otherUsers);
      console.log("Other users", otherUsers.map((user) => user.name));
      setUsers(fetchedUsers);
      setLoading(false);
    };
  };

  const handleCheckIn = async () => {

    if (checkIn) {
      alert("You have already checked in today");
      return;
    }
    router.replace("/DailyPicture");
  };


  // Function to update the users list after sending a friend request
  const updateFetchedUsers = (updatedUser: IUser) => {
    const updatedUsers = users.map((user) => (user.uid === updatedUser.uid ? updatedUser : user));
    setUsers(updatedUsers);
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 10, paddingHorizontal: 5 }}
      >
        {userGym && <Header GymName={userGym[1]} />}
        <Row mb={1} mr="1" ml="1" space={2} alignItems="center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/Filter")} >
            <Octicons name="filter" size={35} color="#F97316" />
          </TouchableOpacity>
          <Input flex={1} mb="1.5"
            InputLeftElement={
              <Box paddingLeft={2}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleSearchUsers} >
                  <FontAwesome name="search" size={24} color="#A3A3A3" />
                </TouchableOpacity>
              </Box>
            }
            placeholder="Spot someone in this gym"
            bgColor="trueGray.100"
            onChangeText={setSearchTerm}
            borderRadius="md"
            borderWidth={1}
            fontSize="md"
            onSubmitEditing={handleSearchUsers}
          />
        </Row>
        {loading &&
          <Column flex={1} alignItems="center" alignContent="center" justifyContent="center">
            <Spacer />
            <Spinner size="md" mb={2} color="#F97316" accessibilityLabel="Loading posts" />
            <Heading color="#F97316" fontSize="md"> Loading</Heading>
          </Column>}
        {!firstLoad && !loading && users.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#A3A3A3">
              Oops! There are no users matching your search. 🤔
            </Text>
            < Text />
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#A3A3A3">
              Try broadening your search to discover more amazing users!
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1, zIndex: 0 }}>
            <Row>
              <Column flex={1} mr={1}>
                {checkedUsers.slice(0, Math.ceil(checkedUsers.length / 2)).map((user) => (
                  <Pressable onPress={() => handlePreviewClick(user)} key={user.uid}>
                    {({ isPressed }) => {
                      return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"}
                        style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                        shadow="3" borderRadius="xl" mb={3} ml={1} mr={1} pl={0.5} pr={0.5}>
                        <CheckedUserPreview friend={user} key={user.uid} />
                      </Box>
                    }}
                  </Pressable>))}
              </Column>
              <Column flex={1} ml={1}>
                {checkedUsers.slice(Math.ceil(checkedUsers.length / 2)).map((user) => (
                  <Pressable onPress={() => handlePreviewClick(user)} key={user.uid}>
                    {({ isPressed }) => {
                      return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"}
                        style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                        shadow="3" borderRadius="xl" mb={3} mr={0.5} pl={0.5} pr={0.5}>
                        <CheckedUserPreview friend={user} key={user.uid} />
                      </Box>
                    }}
                  </Pressable>))}
              </Column>
            </Row>

            {otherUsers.map((user) => (
              <Pressable onPress={() => handlePreviewClick(user)} key={user.uid}>
                {({ isPressed }) => {
                  return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"}
                    style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                    shadow="1" borderRadius="xl" mb={3}>
                    <UserPreview friend={user} key={user.uid} />
                  </Box>
                }}
              </Pressable>))}
          </ScrollView>
        )}
        {selectedUser &&
          <UserExpandedPreview users={users} user={selectedUser} isOpen={isOpen} onClose={handleCloseModal} updateFetchedUsers={updateFetchedUsers} />
        }
        <Button
          size={"lg"}
          borderRadius={30}
          position={"absolute"}
          width={150}
          height={16}
          bottom={5}
          right={3}
          shadow="3"
          background={"#F97316"}
          justifyContent={"center"}
          alignItems={"center"}
          _pressed={{ opacity: 0.5 }}
          onPress={() => handleCheckIn()}
        >
          <Text fontWeight="bold" fontSize="lg" color="#FFF"> Check In </Text>
        </Button>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
/*
    const location = await GetUserLocation();
    if (checkIn) {
      alert("You have already checked in today");
      return;
    } else {
      if (location) {
        setLocation(location);
        if (pointInPolygon(location, bound.current)) {
          router.push("/CheckInOne");
        } else {
          alert(
            "You are not at the gym location, please check in at the gym location"
          );
        }
      } else {
        alert("Please enable location services to check in");
      }
    }

*/