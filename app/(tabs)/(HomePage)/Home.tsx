import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  NativeBaseProvider,
  Input,
  IconButton,
  Row,
  Flex,
  Box,
  Button,
  Text,
  Badge,
} from "native-base";
import {
  Image,
  ScrollView,
  ActivityIndicator,
  Button as RButton,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
import {
  IUser,
  getUsers,
  getCurrUser,
  updateUsers,
  removeFieldFromUsers,
  Gym,
} from "@/components/FirebaseUserFunctions";
import UserPreview from "../../../components/HomeComponents/UserContainer";
import Header from "../../../components/HomeComponents/Header";
import theme from "@/components/theme";
import updateUser from "@/components/storage";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [gym, setGym] = useState<Gym>(); // State to store the gym input
  const [user, setUser] = useState<IUser>(); // State to store the current user
  const [gymId, setGymId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [location, setLocation] = useState<Location.LocationObjectCoords>(); 
  const { currUser, User } = useAuth();
  if (!User) return;
  if (!currUser) return;

  useEffect(() => {
    // Fetch gym name for current user
    const fetchGym = async () => {
      setUser(currUser);
      if (user){
        const gymDocRef = doc(firestore, "Gyms", user.gymId);
        const userGym = (await getDoc(gymDocRef)).data() as Gym;
        setGym(userGym);
        // console.log(user);
        handleGetUsers();
      }
    };
    
    fetchGym();

    if (User){
      const unsubscribe = onSnapshot(doc(firestore, 'Users', User.uid), (snapshot) => {
        const updatedUser = snapshot.data() as IUser;
        setUser(updatedUser);
      });
    
      // Clean up the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [User]);

  // TODO: Display user preview when clicked
  const handlePreviewClick = (user: IUser) => {
    // Do something when user is clicked
    // Open Profile
  };

  // Get users from database from gym
  const handleGetUsers = async () => {
    /// await updateUser(currUser.uid);
    // updateUsers(); // Uncomment when we want to use it to add fields
    setUsers([]);
    setLoading(true);
    if (user){
      const fetchedUsers = await getUsers(User.uid, user.gymId);
      setUsers(fetchedUsers);
    }
    setLoading(false);
  };

  // Search users by name
  const handleSearchUsers = async () => {
    setUsers([]);
    setLoading(true);
    let fetchedUsers: IUser[];
    if (searchTerm == "") {
      fetchedUsers = await getUsers(User.uid);
    } else {
      // fetchedUsers = await getUsers(currUser.uid);
      fetchedUsers = await getUsers(User.uid);
      console.log(fetchedUsers);
    }
    setUsers(fetchedUsers);
    setLoading(false);
  };

  const getPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return true;
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  }
  const getUserlocation = () => {
    setTimeout(async () => {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    }, 1000);
  }
  useEffect(() => {
    getPermission().then((status) => {
      if (status) return;
      getUserlocation();
    });

  }, [location]);

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 15, paddingTop: 2 }}
      >
        <ScrollView>
          <Header GymName={user? user.gym : ""} />
          <Input
            InputLeftElement={
              <IconButton
                size="xs"
                onPress={handleSearchUsers}
                icon={<FontAwesome name="search" size={24} color="#075985" />}
              />
            }
            placeholder="Spot someone in this gym"
            bgColor="trueGray.100"
            onChangeText={setSearchTerm}
            borderRadius="md"
            borderWidth={1}
          />
          <Row mb={1}>
            <IconButton
              size="xs"
              onPress={() => router.push("/Filter")}
              icon={<Ionicons name="filter" size={24} color="#075985" />}
            />
            <IconButton
              size="xs"
              onPress={() => router.push("/Friends")}
              icon={
                <FontAwesome5 name="user-friends" size={24} color="#075985" />
              }
            />
          </Row>
          {users.map((user) => (
            <UserPreview friend={user} key={user.uid} />
          ))}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </ScrollView>
        <Button
          size={"lg"}
          borderRadius={30}
          position={"absolute"}
          top={675}
          left={280}
          background={"#0284C7"}
          onPress={() => console.log("hello")}
        >
          {" "}
          Check In
        </Button>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
