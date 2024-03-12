import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  NativeBaseProvider,
  extendTheme,
  Box,
  Flex,
  FlatList,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import Gym from "./SelectGymComponents/GymComponent";
import GeneralHeading from "@/components/GeneralHeading";
import { FontAwesome } from "@expo/vector-icons";
import {
  GooglePlacesAutocomplete,
  Point,
} from "react-native-google-places-autocomplete";

interface GymIcon{
  photoURL: string;
  height: number;
  width: number;
}
interface Gym {
  name: string;
  vicinity: string;
  photo: GymIcon | undefined; 
  place_id: string;
}
export default function SelectGym() {
  const [SearchLocation, setSearchLocation] = useState<Point | undefined>(undefined);
  const [NearbyGyms, setNearbyGyms] = useState<Gym[]>([]); // [name, address, photoURL, rating, openNow, distance,
  useEffect(() => {
    // Make sure SearchLocation is defined and has the necessary properties
    if (!SearchLocation || SearchLocation.lat === undefined || SearchLocation.lng === undefined) return;
    const fetchNearbyGyms = async () => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${SearchLocation.lat},${SearchLocation.lng}&rankby=distance&type=gym&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
  
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const Gymdata = await response.json();
  
        const newGyms = Gymdata.results.map((place:any) => ({
          name: place.name,
          vicinity: place.vicinity,
          photo: place.photos ? {
            photoURL: place.photos[0].photo_reference,
            height: place.photos[0].height,
            width: place.photos[0].width,
          } : undefined, 
          place_id: place.place_id,
        }));
        setNearbyGyms(newGyms);
      } catch (error) {
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
        <GeneralHeading
          title="Select Gym"
          subtitle="Select the gym you want to go to"
          Icon={<FontAwesome name="map-o" size={50} color="#F0F9FF" />}
        />
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
            <Gym title={item.name} Address={item.vicinity} 
            photo = {item.photo}
            />
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
