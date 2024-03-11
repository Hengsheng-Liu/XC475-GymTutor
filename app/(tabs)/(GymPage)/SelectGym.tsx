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
import Gym from "./SelectGymComponents/Gym";
import GeneralHeading from "@/components/GeneralHeading";
import { FontAwesome } from "@expo/vector-icons";
import {
  GooglePlacesAutocomplete,
  Point,
} from "react-native-google-places-autocomplete";

export default function SelectGym() {
  const [SearchLocation, setSearchLocation] = useState<Point | undefined>(
    undefined
  );
  const fetchNearbyGyms = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Back Bay Fitness Center",
      Address: "915 Commonwealth Ave, Boston",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "BU Fitrec Center",
      Address: "915 Commonwealth Ave, Boston",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Planet Fitness",
      Address: "915 Commonwealth Ave, Boston",
    },
  ];
  useEffect(() => {
    if (SearchLocation === undefined) return;

    const getNearbyGyms = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${SearchLocation.lat},${SearchLocation.lng}
&rankby=distance&type=gym&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
    fetchNearbyGyms(getNearbyGyms).then((data) => {
      console.log(data);
      
    });
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
          SearchFeature={(e: string) => console.log("e")}
          SearchBarText="Search for a gym"
        />
        <Box m={2}>
          <GooglePlacesAutocomplete
            placeholder="Enter your zip code to search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true

              setSearchLocation(details?.geometry.location);
              console.log(SearchLocation);
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
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
              rankby: "distance",
              type: "cafe",
            }}
            fetchDetails
          />
        </Box>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Gym title={item.title} Address={item.Address} />
          )}
          keyExtractor={(item) => item.id}
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
