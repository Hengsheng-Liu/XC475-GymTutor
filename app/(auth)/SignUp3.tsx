import { useState } from "react";
import { NativeBaseProvider, Select, Box, CheckIcon, Flex, Pressable, Input, Button, extendTheme,
  ChevronLeftIcon,
  HStack,
  Icon,
   Text,
   ScrollView
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import Tags from "../../components/ProfileComponents/Tags";

import {

  Alert,

  StyleSheet,
  View,

  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { firestore } from "../../firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc,setDoc,doc, updateDoc } from "firebase/firestore";
import { useAuth} from "../../Context/AuthContext";

import { useRoute } from '@react-navigation/native';

import { addUser } from "@/components/FirebaseUserFunctions"

import { Filters, defaultFilters } from '@/app/(tabs)/(HomePage)/Filter';

export default function SignUpScreen3() { 

       

    const theme = extendTheme({
        colors: {
          primary: {
          50: '#7C2D12',
          100: '#F97316',
          200: "#171717",
          300: "#FAFAFA"
          },
        },
        components: {
          Button: {
            baseStyle: {
              color: "primary.50",
              rounded: "full",
            },
          },
          Text: {
            fontSize:"50",
            fontFamily:"Roberto",
            color: "primary.50"
          }
        },
      });
    
    return (
        <NativeBaseProvider theme={theme}>
          <Box bg="primary.50">
            <Text> Your account</Text>
        </Box>
        </NativeBaseProvider>

    )
}