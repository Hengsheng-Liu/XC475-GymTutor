import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/Context/AuthContext';
import { Slot } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

/*
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/LogIn',
};
*/

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
          setLoadingComplete(true);
      }, 2000); // Wait 2 seconds
      
      return () => clearTimeout(timer); // Cleanup function
    }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && loadingComplete) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loadingComplete]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
      <AuthProvider>
        <NativeBaseProvider>
        <Slot /> 
        </NativeBaseProvider>
      </AuthProvider>
  );
}
