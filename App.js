import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
navigator.geolocation = require('@react-native-community/geolocation');
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
