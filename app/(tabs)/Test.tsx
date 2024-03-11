import { Heading, NativeBaseProvider, Box } from "native-base";
import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'dotenv/config';
export default function Test() {
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
            }}
          />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ecf0f1",
  },
});
