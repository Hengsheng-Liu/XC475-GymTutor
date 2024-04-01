import { Heading, NativeBaseProvider, Box } from "native-base";
import { SafeAreaView, StyleSheet, View,Image } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
export default function Test() {
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>


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
