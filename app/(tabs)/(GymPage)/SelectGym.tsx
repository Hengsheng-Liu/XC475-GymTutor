import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import Gym from "./SelectGymComponents/Gym";
import GeneralHeading from "@/components/GeneralHeading";
import { FontAwesome } from "@expo/vector-icons";
export default function SelectGym() {
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
      <ScrollView>
        <SafeAreaView style={styles.conatiner}>
          <GeneralHeading
            title="Select Gym"
            subtitle="Select the gym you want to go to"
            Icon={
              <FontAwesome
                name="map-o"
                size={50}
                color="#F0F9FF"
                SearchFeature={(e:string) => console.log("e")}
              />
            }
            SearchBarText="Search for a gym"
          />
          <Gym />
          <Gym />
          <Gym />
          <Gym />
          <Gym />
          <Gym />
        </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "#0369A1",
  },
});
