import { StyleSheet, Button,Text, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../../Context/AuthContext";
export default function TabOneScreen() {
  const { User, SignOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await SignOut();
      router.navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});