import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  NativeBaseProvider,
  extendTheme,
  Box,
  Flex,
  FlatList,
  Heading,
  Text,
  Pressable,
  Spacer,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import Gym from "../../../components/SelectGymComponents/GymComponent";
import { FontAwesome } from "@expo/vector-icons";
import {
  GooglePlacesAutocomplete,
  Point,
  Geometry
} from "react-native-google-places-autocomplete";
import { useAuth } from "@/Context/AuthContext";
import { router } from "expo-router";

interface GymIcon {
  photoURL: string;
  height: number;
  width: number;
}
interface Gym {
  name: string;
  vicinity: string;
  photo: GymIcon | undefined;
  place_id: string;
  geometry: Geometry;
}
export default function SelectGym() {
  const [SearchLocation, setSearchLocation] = useState<Point | undefined>(
    undefined
  );
  const [NearbyGyms, setNearbyGyms] = useState<Gym[]>([]);
  const { userGym } = useAuth();
  if (!userGym) return router.replace("/LoadingPage");

  useEffect(() => {
    // Make sure SearchLocation is defined and has the necessary properties

    if (
      !SearchLocation ||
      SearchLocation.lat === undefined ||
      SearchLocation.lng === undefined
    )
      return;
    const fetchNearbyGyms = async () => {
      
      const url = process.env.EXPO_PUBLIC_FetchGym_URL+`?lat=${SearchLocation.lat}&lng=${SearchLocation.lng}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const Gymdata = await response.json();

        const newGyms = Gymdata.results.map((place: any) => ({
          name: place.name,
          vicinity: place.vicinity,
          photo: place.photos
            ? {
                photoURL: place.photos[0].photo_reference,
                height: place.photos[0].height,
                width: place.photos[0].width,
              }
            : undefined,
          place_id: place.place_id,
          geometry: place.geometry
        }));
        setNearbyGyms(newGyms);
      } catch (error) {
        console.log(url);
        console.error("Error fetching nearby gyms:", error);
      }
    };
    setNearbyGyms([]);
    fetchNearbyGyms();
  }, [SearchLocation]);

  const theme = extendTheme({
    components: {
      Text: {
        baseStyle: {
          color: "#F0F9FF",
        },
      },
      Heading: {
        baseStyle: {
          color: "#F0F9FF",
        },
      },
    },
  });
  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Box margin={2} mt={3}>
            <Flex flexDirection={"row"} alignItems={"center"} justifyContent={"right"}>
            { (userGym[0] !== "" && userGym[1] !== "") && 
              <Pressable pr={2} onPress={() => router.replace("./Home")}>
                <FontAwesome name="chevron-left" size={30} color="#FFF" />
              </Pressable>
            }
              <Box>
                <Heading> Select Your Gym </Heading>
                <Text> Find the gym that you go most often </Text>
              </Box>
              <Spacer/>
              <FontAwesome name="map-o" size={50} color="#F0F9FF" />
            </Flex>
        </Box>
        <Box m={2}>
          <GooglePlacesAutocomplete
            placeholder="Enter your zip code to search"
            onPress={(data, details = null) => {
              setSearchLocation(details?.geometry.location);
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
              language: "en",
            }}
            styles={{
              container: {
                flex: 0,
              },
            }}
            fetchDetails
          />
        </Box>
        <FlatList
          data={NearbyGyms}
          renderItem={({ item }) => (
            <Gym title={item.name} Address={item.vicinity} photo={item.photo} Geometry={item.geometry} place_id={item.place_id}/>
          )}
          keyExtractor={(item) => item.place_id}
        ></FlatList>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0369A1",
  },
});
