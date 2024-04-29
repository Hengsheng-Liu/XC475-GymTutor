import { useState } from "react";
import { View } from "react-native";
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { firestore } from "../../firebaseConfig";
import { router } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { addUser } from "@/components/FirebaseUserFunctions"
import {
  Box,
  Button,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Spacer,
  Tag,
  extendTheme,
  Flex,
  Input,
  Text,
  HStack,
  IconButton,
  Icon,
  ChevronLeftIcon
} from "native-base";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const { CreateUser } = useAuth();

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (password !== text) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleSignUp = async () => {

    // Regex for basic email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (name && email && password && confirmPassword && password === confirmPassword) {

      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      console.log('name is ' + name);
      try {
        router.navigate({
          pathname: "SignUp2",
          params: {
            name: name,
            password: password,
            email: email,

          }
        });

        // const userCredential = await CreateUser(email, password);
        // const user = userCredential.user;

      } catch (error: any) {
        Alert.alert("Error", error.message);
      }

    } else {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
      }
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const theme = extendTheme({
    colors: {
      primary: {
        50: '#7C2D12',
        100: '#F97316',
        200: "#171717",
        300: "#FAFAFA",
        400: "#FFFFFF"
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
        fontSize: "50",
        fontFamily: "Roberto",
        color: "primary.50"
      }
    },
  });

  return (

    <NativeBaseProvider theme={theme}>


      <HStack px="5" mt="5" py="10" justifyContent="space-between" alignItems="center" w="100%" bg="primary.400">


        <Button bg="primary.400" startIcon={<ChevronLeftIcon size="md" color="primary.200" />} onPress={() => router.navigate("LogIn")}></Button>
        <Text fontSize="20" fontWeight="bold" textAlign="center" flex="1" color="primary.200" mr="10" p="2">
          Registration
        </Text>

      </HStack>

      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>


        <ScrollView backgroundColor={"#FFFFFF"} contentContainerStyle={{ flexGrow: 1 }}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"} flex="1">



            <Text fontSize="28" fontWeight="700" color="primary.200" lineHeight="28" p="3">Create an account</Text>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="1">Your Name</Text>

            <Box alignItems="left">

              <Input mx="3" w="90%" value={name} onChangeText={setName} />

            </Box>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Email</Text>

            <Box alignItems="left">

              <Input mx="3" w="90%" value={email} onChangeText={setEmail} />

            </Box>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Password</Text>

            <Box alignItems="left">

              <Input mx="3" w="90%" value={password} onChangeText={handlePasswordChange} secureTextEntry />

            </Box>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Confirm Password</Text>

            <Box alignItems="left">

              <Input mx="3" w="90%" value={confirmPassword} onChangeText={handleConfirmPasswordChange} secureTextEntry />

            </Box>




            {passwordMatchError && <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20" letterSpacing="0.25" p="3" mt="3">
              Passwords do not match
            </Text>}

            <Flex direction="column" flexGrow="1" justifyContent="flex-end">

              <Button bg="primary.100" onPress={handleSignUp} rounded="md" > Next </Button>
            </Flex>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 50,
    backgroundColor: "white",
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "200",
  },
  loginTextField: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "300",
    marginBottom: 20,
  },
  mainContent: {
    flex: 6,
  },
});
