import { useState, useRef} from "react";
import { Pressable, View } from "react-native";
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { firestore, auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { UserCredential, fetchSignInMethodsForEmail } from "firebase/auth";
import { useAuth } from "../../Context/AuthContext";
import { addUser } from "@/components/FirebaseUserFunctions";
import { getDocs, query, where, collection } from "firebase/firestore";
import {
  Box,
  Button,
  NativeBaseProvider,
  extendTheme,
  Flex,
  Input,
  Text,
  ChevronLeftIcon,
  Heading,
} from "native-base";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const Email_focus = useRef();
  const Password_focus = useRef();
  const ConfirmPassword_focus = useRef();


  const { CreateUser } = useAuth();


  const [passwordSecureError, setPasswordSecureError] = useState<string | null>(null);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    
    // Password security requirements
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(text);
    const hasLowercase = /[a-z]/.test(text);
    const hasNumber = /\d/.test(text);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);

    if (text.length < minLength) {
      setPasswordSecureError(`Password must be at least ${minLength} characters long.`);
    } else if (!hasUppercase) {
      setPasswordSecureError("Password must include at least one uppercase letter.");
    } else if (!hasLowercase) {
      setPasswordSecureError("Password must include at least one lowercase letter.");
    } else if (!hasNumber) {
      setPasswordSecureError("Password must include at least one number.");
    } else if (!hasSpecialChar) {
      setPasswordSecureError("Password must include at least one special character.");
    } else {
      setPasswordSecureError(null);
    }

    // Check for password match
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

    if (
      name &&
      email &&
      password &&
      confirmPassword &&
      !passwordMatchError &&
      !passwordSecureError
    ) {
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      // Firestore query to check for existing email
      const querySnapshot = await getDocs(
        query(collection(firestore, "Users"), where("email", "==", email))
      );

      if (!querySnapshot.empty) {
        Alert.alert(
          "Error",
          "Email already in use. Please use a different email."
        );
        return;
      }

      console.log("name is " + name);
      try {
        router.navigate({
          pathname: "SignUp2",
          params: {
            name: name,
            password: password,
            email: email,
          },
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
      else if (passwordSecureError) {
        Alert.alert("Error", passwordSecureError);
      }
      else{
        Alert.alert("Error", "Please fill in all fields");
      }
    }
  };

  const theme = extendTheme({
    colors: {
      primary: {
        50: "#7C2D12",
        100: "#F97316",
        200: "#171717",
        300: "#FAFAFA",
        400: "#FFFFFF",
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
        color: "primary.50",
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Pressable onPress={Keyboard.dismiss} style={styles.contentView}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Flex
            flexDir={"row"}
            justifyContent="space-between"
            alignItems="center"
            ml="3"
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate("LogIn")}
            >
              <ChevronLeftIcon size="md" color="primary.200" />
            </TouchableOpacity>
            <Text
              fontSize="20"
              fontWeight="bold"
              textAlign="center"
              flex="1"
              color="primary.200"
              mr="10"
              p="2"
            >
              Registration
            </Text>
          </Flex>

          <Box paddingTop={"10"} flex="1" paddingLeft={2}>
            <Text fontSize="28" fontWeight="700" color="primary.200" ml={2}>
              Create an account
            </Text>

            <Text
              fontSize="16"
              fontWeight="400"
              color="primary.200"
              lineHeight="20"
              letterSpacing="0.25"
              p="3"
              mt="1"
            >
              Your Name
            </Text>

            <Box alignItems="left">
              <Input
                mx="3"
                w="90%"
                value={name}
                onChangeText={setName}
                _focus={{
                  borderColor: "primary.100", 
                  backgroundColor: "white", 
                }}
                onSubmitEditing={() => {Email_focus.current.focus();}}            
              />
            </Box>

            <Text
              fontSize="16"
              fontWeight="400"
              color="primary.200"
              lineHeight="20"
              letterSpacing="0.25"
              p="3"
              mt="3"
            >
              Email
            </Text>

            <Box alignItems="left">
              <Input
                mx="3"
                w="90%"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
                _focus={{
                  borderColor: "primary.100", // Change to your preferred color
                  backgroundColor: "white", // Change background color on focus
                }}
                ref = {Email_focus}
                onSubmitEditing={() => {Password_focus.current.focus();}}
              />
            </Box>

            <Text
              fontSize="16"
              fontWeight="400"
              color="primary.200"
              lineHeight="20"
              letterSpacing="0.25"
              p="3"
              mt="3"
            >
              Password
            </Text>

            <Box alignItems="left">
              <Input
                mx="3"
                w="90%"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                _focus={{
                  borderColor: "primary.100", // Change to your preferred color
                  backgroundColor: "white", // Change background color on focus
                }}
                ref = {Password_focus}  
                onSubmitEditing={() => {ConfirmPassword_focus.current.focus();}}
              />
            </Box>
            {passwordSecureError && (
              <Text
                fontSize="16"
                fontWeight="400"
                color="primary.50"
                lineHeight="20"
                letterSpacing="0.25"
                pl="3" pr="3" pt="2"
                mt="0"
              >
                {passwordSecureError}
              </Text>
            )}

            <Text
              fontSize="16"
              fontWeight="400"
              color="primary.200"
              lineHeight="20"
              letterSpacing="0.25"
              p="3"
              mt="3"
            >
              Confirm Password
            </Text>

            <Box alignItems="left">
              <Input
                mx="3"
                w="90%"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                _focus={{
                  borderColor: "primary.100", // Change to your preferred color
                  backgroundColor: "white", // Change background color on focus
                }}
                ref = {ConfirmPassword_focus}
                onSubmitEditing={handleSignUp}
              />
            </Box>

            {passwordMatchError && (
              <Text
                fontSize="16"
                fontWeight="400"
                color="primary.50"
                lineHeight="20"
                letterSpacing="0.25"
                pl="3" pr="3" pt="2"
                mt="0"
              >
                Passwords do not match
              </Text>
            )}
            
          </Box>
          <Flex alignItems={"center"} ml={10} mr={10} mb={1}>
            <Button
              background={"#F97316"}
              _pressed={{ opacity: 0.5 }}
              onPress={handleSignUp}
              rounded="md"
              height={"12"}
              shadow="3"
              mt={4}
              width="100%"
              pt="3.5"
              pb="3.5"
              borderRadius={5}
            >
              <Heading color={"#FFF"} fontStyle="normal" fontSize="md">
                Next
              </Heading>
            </Button>
          </Flex>
        </SafeAreaView>
      </Pressable>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "#FFF",
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
