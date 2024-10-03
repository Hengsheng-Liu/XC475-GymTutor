import { View } from "react-native";
import { useRef } from "react";
import {
  Alert,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { Text, Box, Button, Center, Column, Row } from "native-base";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { useAuth } from "../../Context/AuthContext";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";
// In anotherFile.js
import {
  expoClientId,
  iosClientId,
  androidClientId,
  auth,
} from "../../firebaseConfig";
import {
  signInWithCredential,
  User,
  GoogleAuthProvider,
  OAuthCredential,
  AuthError,
  getAdditionalUserInfo,
  UserCredential,
} from "firebase/auth";
import { firestore } from "../../firebaseConfig";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { Flex, Heading, Input, NativeBaseProvider } from "native-base";
import Logo from "../../assets/images/Logo.svg";
export default function LogInScreen() {
  // Hook that gives us the function to authenticate our Google OAuth provider
  /*
  const [, googleResponse, promptAsyncGoogle] = useGoogleIdTokenAuthRequest({
    selectAccount: true,
    expoClientId,
    iosClientId,
    androidClientId
  });
  */
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const { SignIn } = useAuth();
  const Password_focus = useRef();

  const handleLogIn = async () => {
    // Skip credentials (Developer use only)
    // const userCredential = await SignIn("a@gmail.com", "password"); // (to skip the email verification)
    // const user = userCredential.user;
    // if (user) {
    //   router.replace("/LoadingPage");
    // }

    if (email && password) {
      try {
        const userCredential = await SignIn(email, password);
        const user = userCredential.user;
        if (user) {
          router.replace("/LoadingPage");
        }
      } catch (error: any) {
        const errorMessage = error.message;
        Alert.alert("Error", errorMessage);
      }
    }
  };

  // Code below handles the login via the Google Provider
  /*
  const handleLoginGoogle = async () => {
    try {
      await promptAsyncGoogle();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Login Error", "Failed to sign in with Google. Please try again.");
    }
  };
  */

  // Function that logs into firebase using the credentials from an OAuth provider
  /*
  const GoogleloginToFirebase = useCallback(async (credentials: OAuthCredential) => {
    try {
      const signInResponse = (await signInWithCredential(auth, credentials));

      // Handle successful sign-in
      if (getAdditionalUserInfo(signInResponse)?.isNewUser) {
        // Handle the new user case
        console.log("This is a new user.");
        router.navigate({
          pathname: "SignUp2",
          params: {
            uid: signInResponse.user.uid,
            email: signInResponse.user.email,
          }
        });
      } else {
        // Handle the existing user case
        console.log("This is an existing user.");
      }
    } catch (error) {

      const firebaseError = error as AuthError; // Type assertion

      if (firebaseError.code === 'auth/account-exists-with-different-credential') {
        // An account already exists with the same email address but different sign-in credentials
        Alert.alert("Account Exists", "An account already exists with the same email address but with a different sign-in method.");
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        // The email address is already in use by another account
        Alert.alert("Email In Use", "This email address is already in use by another account.");
      } else {
        // Handle other errors
        Alert.alert("Login Error", firebaseError.message);
      }
      console.error("Firebase Sign-In Error:", error);
    }
  }, []);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const credentials = GoogleAuthProvider.credential(
        googleResponse.params.id_token
      );
      GoogleloginToFirebase(credentials);
    }
  }, [googleResponse]);
  */

  return (
    <NativeBaseProvider>
      <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.contentView}>
          <Flex flex={"1"} marginX={10} bg={"#FFF"}>
            <Box style={styles.circularDivider} />
            <Flex flexDir={"row"} marginTop={"1/4"} alignItems={"center"} justifyContent={"left"}>
              <Heading mt={1.5} mr={1} size={"xl"} color={"#FAFAFA"}>
                Welcome to
              </Heading>
              <Logo width={120} height={60} />
            </Flex>
            <Box marginTop={"6"}>
              <Text color={"#FAFAFA"}>Email</Text>
              <Input
                mt={2}
                size="md"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                inputMode="email"
                autoCapitalize="none"
                backgroundColor={"#FAFAFA"}
                borderRadius={5}
                shadow={2}
                autoCorrect={false}
                onSubmitEditing={() => Password_focus.current.focus()}
              />
              <Text color={"#FAFAFA"} marginTop={5}>
                Password
              </Text>
              <Input
                size="md"
                mt={2}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                backgroundColor={"#FAFAFA"}
                borderRadius={5}
                onSubmitEditing={handleLogIn}
                shadow={2}
                ref={Password_focus}
              />
            </Box>
            <Button
              background={"#FFF"}
              onPress={handleLogIn}
              marginTop={"16"}
              borderRadius={5}
              shadow="3"
              _pressed={{ opacity: 0.5 }}
            >
              <Heading color={"#F97316"} size={"md"}>
                Log In
              </Heading>
            </Button>
            <Column flex={1} mb={2} alignItems="center" alignContent="center" justifyContent="flex-end">
              <Text color={"#C2410C"} marginTop={"10"} fontSize="md">
                Don't have an account?
              </Text>
              <Button
                background={"#F97316"}
                onPress={() => router.navigate("SignUp2")}
                mt={4} width="100%" pt="3.5" pb="3.5"
                borderRadius={5}
                shadow="3"
                _pressed={{ opacity: 0.5 }}
              >
                <Heading color={"#FFF"} fontStyle="normal" fontSize="md">
                  Sign up with email
                </Heading>
              </Button>
            </Column>
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
  circularDivider: {
    position: "absolute",
    backgroundColor: "#F97316",
    width: 1200, // Adjust the width as needed to make the circle larger than the screen
    height: 1200, // Adjust the height as needed to make the circle larger than the screen
    borderRadius: 600, // Half of the width and height to make it a perfect circle
    top: -600, // Position it above the screen
    left: -450, // Position it to the left of the screen
    zIndex: -1, // Ensure it's behind other content
  },
});
