import { useState } from "react";
import { View, Text } from "react-native";
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
import { router, useLocalSearchParams } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc,setDoc,doc, updateDoc } from "firebase/firestore";
import { useAuth} from "../../Context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function SignUpScreen2() { 
    const {User}= useAuth(); 
    console.log("user frorm useAuth", User);

    const {uid, email} = useLocalSearchParams();
    console.log("token", uid, email);

    const [name, setName] = useState<string | undefined>();

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
  
   // const [age, setAge] = useState<string | undefined>();
    const [bio, setBio] = useState<string | undefined>();
    const [gender, setGender] = useState<string | undefined>();




    // functions related to the calendar for Date of Birth
    const dateOnChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        console.log("currentdate", currentDate);
        setShow(false);
        setDate(currentDate);
      };
    
      const showMode = (currentMode: any) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };



  const AddUserToDB = async () => {
    const db = firestore;
    
    if (User?.uid) {
    try {
        await setDoc(doc(db, "Users", User.uid), {
        achievements: [],
        age: date,
        bio: bio,
        blockedUsers: [],
        checkInHistory: [],
        currentlyMessaging: [],
        email: email,
        friendRequests: [],
        friends: [],
        gym: "",
        gymExperience: "",
        icon: "",

        name: name,
        rejectedRequests: [],
        sex: gender,
        tags: [],
        uid: uid,  

      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
    }
}
  };
      const finishSignUp = async () => {
        if (date && name && gender && bio) {
  //          await updateDB(userCredential);
            console.log("dababy");
            await AddUserToDB();
      
    
            }
            else {
            Alert.alert("Error", "Please fill in all fields");
            }
        
        router.navigate("LogIn");
        }

        
      


    return (

    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Add Personal Info</Text>
          </View>
          <View style={styles.mainContent}>
            
          <TextInput
              style={styles.loginTextField}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              inputMode="text"
              autoCapitalize="none"
            />

    <Button onPress={showDatepicker} title="Date of Birth" />
      <Text>Selected Date of Birth: {date.toLocaleString().slice(0, 10)}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={dateOnChange}
        />
      )}
        
        <TextInput
              style={styles.loginTextField}
              placeholder="Gender"
              value={gender}
              onChangeText={setGender}
              
            />
        <TextInput
              style={styles.loginTextField}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              
            />

        <Button title="Next" onPress={finishSignUp} />
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
      fontSize: 35,
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
  