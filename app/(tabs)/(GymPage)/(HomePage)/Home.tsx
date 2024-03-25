import React, { useState, useEffect, useRef } from "react";
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
import UserPreview from "../../../../components/HomeComponents/UserContainer";
import Header from "../../../../components/HomeComponents/Header";
import theme from "@/components/theme";
import updateUser from "@/components/storage";
import { doc, GeoPoint, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import * as Location from "expo-location";
import { GetUserLocation } from "@/components/GeolocationFunction";
import pointInPolygon from "point-in-polygon";
export default function HomeScreen() {
  const [gym, setGym] = useState<Gym>(); // State to store the gym input
  const [user, setUser] = useState<IUser>(); // State to store the current user
  const [gymId, setGymId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [location, setLocation] = useState<number[]>([]);
  const bound = useRef<number[][]>([]); // State to store the gym boundary
  const [checkIn, setCheckIn] = useState<boolean>(false); // State to store the gym boundary
  const Day = new Date();
  const Today =
    Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();
  const { User } = useAuth();
  if (!User) return;

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const user = await getCurrUser(User.uid);
        setUser(user);
        const History = user.checkInHistory;
        if (History && History.includes(Today)) {
          setCheckIn(true); // Check if user has checked in today
        }
        const gymDocRef = doc(firestore, "Gyms", user.gymId);
        const userGym = (await getDoc(gymDocRef)).data() as Gym;
        
        userGym.bounding.forEach((point) => {
          bound.current.push([point.latitude, point.longitude]);
        });
        setGym(userGym);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    if (User) {
      fetchGym();
      handleGetUsers();
    }
  }, [User]);
  // TODO: Display user preview when clicked
  const handlePreviewClick = (user: IUser) => {
    // Do something when user is clicked
    // Open Profile
  };

  // Get users from database from gym
  const handleGetUsers = async () => {
    // await updateUser(currUser.uid);
    // updateUsers(); // Uncomment when we want to use it to add fields
    setUsers([]);
    setLoading(true);
    const fetchedUsers = await getUsers(User.uid);
    setUsers(fetchedUsers);
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
  const AddDate = async () => {
    if (user) {
      try {
        const userRef = doc(firestore, "Users", User.uid);
        await updateDoc(userRef, {
          checkInHistory: [...user.checkInHistory, Today],
        });
        setCheckIn(true);
      } catch (error) {
        console.error("Error updating bio: ", error);
      }
    }
  };
  const handleCheckIn = async () => {
    const location = await GetUserLocation();
    if (checkIn) {
      alert("You have already checked in today");
      return;
    } else {
      if (location) {
        setLocation(location);
        if (pointInPolygon(location, bound)) {
          AddDate();
          alert(
            "Wooho seems like you at the location and check in is successful"
          );
        } else {
          alert(
            "You are not at the gym location, please check in at the gym location"
          );
        }
      } else {
        alert("Please enable location services to check in");
      }
    }
  };
  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView
        style={{ backgroundColor: "#FFF", flex: 1, padding: 15, paddingTop: 2 }}
      >
        <ScrollView>
          <Header currUser={User} GymName={user?.gym} />
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
              onPress={handleGetUsers}
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
          onPress={handleCheckIn}
        >
          Check In
        </Button>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
//insde the gym: 42.352057232511406, -71.11682641206473
// outside the gym: 42.35249135900813, -71.11565509642959
//42.35193439884672, -71.11673198835226
//42.352164385569864, -71.11695979401712
