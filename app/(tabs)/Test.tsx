import React from "react";

import { Popover, Box, Button, NativeBaseProvider } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
export default function Test() {
  return (
    <SafeAreaView>
      <NativeBaseProvider>
        <View>

        </View>
      </NativeBaseProvider>
      
    </SafeAreaView>
  );
}
