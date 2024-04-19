import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { NativeBaseProvider, Spacer, Pressable, Text, Box, Column, Spinner, Heading, Input, Row, Button } from "native-base";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
import { IUser, getUsers, updateUsers, removeFieldFromUsers, Gym } from "@/components/FirebaseUserFunctions";
import UserPreview from "../../../components/HomeComponents/UserContainer";
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


export default function HomeScreen() {
  // const [gym, setGym] = useState<Gym>(); // State to store the gym
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [firstLoad, setFirstLoad] = useState<boolean>(true); // State to track first load
  const isFocused = useIsFocused(); // Use the useIsFocused hook to track screen focus
  const { User, currUser, userGym } = useAuth();
  const [location, setLocation] = useState<number[]>([]);
  const bound = useRef<number[][]>([]); // State to store the gym boundary
  const [checkIn, setCheckIn] = useState<boolean>(false); // State to store the gym boundary
  const Day = new Date();
  const Today =
    Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();


  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!User) return;

  // Initialize gym data
  useEffect(() => {
    if (!userGym || userGym[0] === "" || userGym[1] === "") {
      router.push("/index");
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

  // TODO: Display user preview when clicked
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
      setLoading(true);

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

      setUsers(fetchedUsers);
      setLoading(false);
    };
  };
  
  const handleCheckIn = async () => {
    /*
    const location = await GetUserLocation(); {
      if (location) {
        console.log(location);
        setLocation(location);
        if (pointInPolygon(location, bound.current)) {
          router.push("/CheckIn");
        } else {
          router.push("/CheckIn");
          alert(
            "You are not at the gym location, please check in at the gym location"
          );
        }
      } else {
        alert("Please enable location services to check in");
      }
    }
    */
    router.push("/CheckIn");
  };
  
  // Function to update the users list after sending a friend request
  const updateFetchedUsers = (updatedUser: IUser) => {
    const updatedUsers = users.map((user) => (user.uid === updatedUser.uid ? updatedUser : user));
    setUsers(updatedUsers);
  };
    
  return ( 
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 15}}
      >
        { userGym && <Header GymName={userGym[1]} />}
        <Row mb={1} space={2} alignItems="center">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/Filter")} >
          <Octicons name="filter" size={35} color="#0284C7" />
        </TouchableOpacity>
        <Input flex={1}
          InputLeftElement={
            <Box paddingLeft={2}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleSearchUsers} >
                <FontAwesome name="search" size={24} color="#0284C7" />
              </TouchableOpacity>
            </Box>
          }
          placeholder="Spot someone in this gym"
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
              Oops! There are no users matching your search. 🤔
            </Text> 
            < Text/>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="#0284C7">
              Try broadening your search to discover more amazing users!
            </Text>   
          </View>
          ) : (
          <ScrollView style={{flex:1, zIndex:0}}>
            {users.map((user) => (
            <Pressable onPress={()=> handlePreviewClick(user)} key = {user.uid}>
              {({ isPressed }) => {
              return <Box bg={isPressed ? "coolGray.200" : "#FAFAFA"} 
                          style={{transform: [{ scale: isPressed ? 0.96 : 1 }]}} 
                          shadow="3" borderRadius="xl" mb ={3} ml={1} mr={1} pr={1}>
                        <UserPreview friend={user} key={user.uid} />
                      </Box>}}
            </Pressable>))}
          </ScrollView>
          )}
        {selectedUser && 
          <UserExpandedPreview users={users} user={selectedUser} isOpen={isOpen} onClose={handleCloseModal} updateFetchedUsers={updateFetchedUsers}/>
        }
        <Button
          size={"lg"}
          borderRadius={30}
          position={"absolute"}
          width={150}
          height={16}
          bottom={5}
          right={3}
          background={"#0284C7"}
          justifyContent={"center"}
          alignItems={"center"}
          onPress={handleCheckIn}
        >
          <Text fontWeight="bold" fontSize="lg" color="#FFF"> Check In </Text> 
        </Button>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
//insde the gym: 42.352057232511406, -71.11682641206473
// outside the gym: 42.35249135900813, -71.11565509642959
//42.35193439884672, -71.11673198835226
//42.352164385569864, -71.11695979401712
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