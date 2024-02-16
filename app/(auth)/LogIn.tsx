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
import { useState } from "react";
import {router} from 'expo-router';
import { useAuth } from '../../Context/AuthContext';
export default function LogInScreen() {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const {SignIn}= useAuth();
    const handleLogIn = async () => {
      if (email && password) {
        try {
          const userCredential = await SignIn(email, password);
          const user = userCredential.user;
          if (user) {
            
            router.replace("/");
          }
        } catch(error:any) {
          const errorMessage = error.message;
          Alert.alert("Error", errorMessage);
        }
      }
    }
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
            <Button title="Sign Up" onPress={()=>router.navigate("SignUp")} />
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