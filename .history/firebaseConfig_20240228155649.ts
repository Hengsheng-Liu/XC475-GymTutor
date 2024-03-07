// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from 'expo-constants';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE2aLs3yu5EDnwQrZifeEDdszBlc89pwA",
  authDomain: "spotme-8591a.firebaseapp.com",
  projectId: "spotme-8591a",
  storageBucket: "spotme-8591a.appspot.com",
  messagingSenderId: "725476446782",
  appId: "1:725476446782:web:d91ecceb72c74f98ffb76f",
  measurementId: "G-EBWDJ625HL"
};

export const expoClientId = Constants.expoConfig?.extra?.EXPO_CLIENT_ID;
export const iosClientId = Constants.expoConfig?.extra?.IOS_CLIENT_ID;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
