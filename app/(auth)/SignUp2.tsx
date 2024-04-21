import { useState } from "react";
import { View, Text } from "react-native";
import { NativeBaseProvider, Select, Box, CheckIcon, Flex, Pressable, Input, Button} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import Tags from "../../components/ProfileComponents/Tags";

import {

  Alert,

  StyleSheet,

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

import { useRoute } from '@react-navigation/native';

import { addUser } from "@/components/FirebaseUserFunctions"

import { Filters, defaultFilters } from '@/app/(tabs)/(HomePage)/Filter';


export const AddUserToDB = async (response: UserCredential, name: string, bio: string, gender: string, gymExperience: string, tags: string[]) => {
  const user = response.user;

  await addUser(user.uid, user.email || "", "", "", name, 21, bio, gender, gymExperience ,{day: 1, month: 1, year: 2000}, defaultFilters, tags);

};

// interface RouteParams {
//   email: string;
//   password: string;
// }

export default function SignUpScreen2() { 
    const { CreateUser } = useAuth();

    // const route = useRoute();
    // const { email, password } = route.params as RouteParams;

   const {name, email, password} = useLocalSearchParams();


    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [gymExperience, setGymExperience] = useState<string>('');
  
   // const [age, setAge] = useState<string | undefined>();
    const [bio, setBio] = useState<string | undefined>();
    const [gender, setGender] = useState<string | undefined>();

    const [editMode, setEditMode] = useState(false);
    const [addTag, setAddTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);



    // // functions related to the calendar for Date of Birth
    // const dateOnChange = (event: any, selectedDate: any) => {
    //     const currentDate = selectedDate;
    //     console.log("currentdate", currentDate);
    //     setShow(false);
    //     setDate(currentDate);
    //   };
    
    //   const showMode = (currentMode: any) => {
    //     setShow(true);
    //     setMode(currentMode);
    //   };
    
    //   const showDatepicker = () => {
    //     showMode('date');
    //   };

      // 2 functions below are for adding tags
      const handleSave = () => {
       // onSaveTag(addTag as string);
       if (addTag.trim() !== "") {
        setTags(prevTags => [...prevTags, addTag]);
      }
        setEditMode(false);
        console.log("name is" + name);
        console.log('email is ' + email);
        console.log('password is ' + password);
    
      }
      const handleCancel = () => {
        setEditMode(false);
      }


//   const AddUserToDB = async () => {
//     const db = firestore;
    
//     if (User?.uid) {
//     try {
//         await setDoc(doc(db, "Users", User.uid), {
//         achievements: [],
//         age: date,
//         bio: bio,
//         blockedUsers: [],
//         checkInHistory: [],
//         currentlyMessaging: [],
//         email: email,
//         friendRequests: [],
//         friends: [],
//         gym: "",
//         gymExperience: "",
//         icon: "",

//         name: name,
//         rejectedRequests: [],
//         sex: gender,
//         tags: [],
//         uid: uid,  

//       });
  
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
// }
//   };
    const finishSignUp = async () => {


    console.log("email is ", email);
    console.log("password is", password);
    console.log("name is" + name as string);

    if (date && gymExperience && gender && bio && tags) {
  //          await updateDB(userCredential);



            console.log("email is ", email);
            console.log("password is", password);
            console.log("name is" + name as string);
            if (email && password) {
              const userCredential = await CreateUser(email as string, password as string);
              const user = userCredential.user;
              await AddUserToDB(userCredential, name as string, bio, gender, gymExperience, tags);

            } else {
              Alert.alert("Error", "User cannot be properly stored in firestore database."); 
      
            }
         
        
        router.navigate("LogIn");
        }   
        else {
          Alert.alert("Error", "Please fill in all fields");
          }

        
        }


    return (
    <NativeBaseProvider>

    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Add Personal Info</Text>
          </View>
          <View style={styles.mainContent}>
            


    <Button  > Choose Date of Birth </Button>




      <Box maxW="300">
        <Select selectedValue={gender} minWidth="200" accessibilityLabel="Choose Gender" placeholder="Gender" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setGender(itemValue)}>
          <Select.Item label="Male" value="male" />
          <Select.Item label="Female" value="female" />
          <Select.Item label="Other" value="other" />
        </Select>
      </Box>

      <Box maxW="300">
        <Select selectedValue={gymExperience} minWidth="200" accessibilityLabel="Choose Gym Experience" placeholder="Gym Experience" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setGymExperience(itemValue)}>
          <Select.Item label="Beginner" value="beginner" />
          <Select.Item label="Intermediate" value="intermediate" />
          <Select.Item label="Advanced" value="advanced" />
        </Select>
      </Box>

<Box 
      flexDirection="column"
      alignItems="flex-start"
      shadow={3} 
      backgroundColor={"gray.100"} 
      mt={2} 
      borderRadius={10}>
 
          <Input
            multiline={true}
            color={"lightBlue.900"} mt={2} padding={3}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your description"
          />

      </Box>

        <Text> What kind of gym goer are you? (basically the add tags part) </Text>


<Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
        {tags.map((str, index) => (
          <Tags key={index} title={str} />
        ))}

        {!editMode && (
          <Pressable onPress={() => setEditMode(true)}>
            <Tags title={"+"} />
          </Pressable>
        )}

        {editMode && (
          <Input
            multiline={false}
            color={"lightBlue.900"}
            mt={2}
            padding={3}
            value={addTag}
            onChangeText={setAddTag}
            placeholder="new tag"
            width="50%"
          />
        )}
      </Flex>

      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
      {editMode && (
        <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleSave}
          backgroundColor={"#0284C7"}
          leftIcon={<AntDesign name="check" size={24} color="white" />}
        >
          Add
        </Button>

      )}
      {editMode && (
          <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleCancel}
          backgroundColor={"#0284C7"}
          leftIcon={<AntDesign name="close" size={24} color="white" />}
        >
          Cancel
        </Button>
      )}
         </Flex>
        <Button onPress={finishSignUp} > Finish Sign Up </Button>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
    

    </NativeBaseProvider>

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
