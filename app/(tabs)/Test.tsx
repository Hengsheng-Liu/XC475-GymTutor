import { Heading, NativeBaseProvider, Box } from "native-base";
import { SafeAreaView, StyleSheet, View,Image } from "react-native";
import React from "react";
import Grey from "../../assets/images/achievements/Uncomplete/Grey.svg"
export default function Test() {
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <Grey/>


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
