import { useState } from "react";
import { View, Text } from "../../components/Themed";
import {
  Alert,
  Button,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { firestore } from "../../firebaseConfig";
import { router } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { addUser } from "@/components/FirebaseDataService"

export const AddUserToDB = async (response: UserCredential) => {
  const user = response.user;

  await addUser(user.uid, user.email || "");

};
export default function SignUpScreen() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
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
    if (email && password && confirmPassword && password === confirmPassword) {
      try {
        const userCredential = await CreateUser(email, password);
        const user = userCredential.user;
        if (user) {

          router.navigate({
            pathname: "SignUp2",
            params: {
              uid: user.uid,
              email: user.email,
              user: user,
            }
          });


        }
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

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Register</Text>
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
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            {passwordMatchError && <Text>Passwords do not match</Text>}
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Go Back" onPress={() => router.navigate("LogIn")} />
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
