import { Text, View } from 'react-native'
import React from 'react'
import {
  Alert,
  Button,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from 'expo-router';
import { useAuth } from '../../Context/AuthContext';
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from 'expo-auth-session/providers/google';
// In anotherFile.js
import { expoClientId, iosClientId, androidClientId, auth } from '../../firebaseConfig';
import { signInWithCredential, User, GoogleAuthProvider, OAuthCredential, AuthError, getAdditionalUserInfo, UserCredential } from "firebase/auth";
import { firestore } from "../../firebaseConfig";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { AddUserToDB } from './SignUp';

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

  const handleLogIn = async () => {
    // Skip credentials (Developer use only)
    // const userCredential = await SignIn("a@gmail.com", "password"); // (to skip the email verification)
    //     const user = userCredential.user;
    //     if (user) {
    //       router.replace("/Home");
    //     }

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
  }






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
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        router.replace("/");
      }
    });
  }, []);

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Log In</Text>
          </View>
          <View style={styles.mainContent}>
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputMode="email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry />
            <Button title="Log In" onPress={handleLogIn} />
            <Button title="Sign Up" onPress={() => router.navigate("SignUp")} />
            {<Button title={'Google Login'} />}
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
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