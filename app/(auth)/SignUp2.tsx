import { useState } from "react";
import { NativeBaseProvider, Select, Box, CheckIcon, Flex, Pressable, Input, Button, extendTheme,
  ChevronLeftIcon,
  HStack,
  Icon,
   Text,
   ScrollView
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import Tags from "../../components/ProfileComponents/Tags";

import {

  Alert,

  StyleSheet,
  View,

  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import { firestore } from "../../firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc,setDoc,doc, updateDoc } from "firebase/firestore";
import { useAuth} from "../../Context/AuthContext";

import { useRoute } from '@react-navigation/native';

import { addUser } from "@/components/FirebaseUserFunctions"

import { Filters, defaultFilters } from '@/app/(tabs)/(HomePage)/Filter';


export const AddUserToDB = async (response: UserCredential, name: string, bio: string, gender: string, gymExperience: string, year: number, month: number, date: number) => {
  const user = response.user;

  await addUser(user.uid, user.email || "", "", "", name, 21, bio, gender, "", gymExperience ,{day: date, month: month, year: year}, defaultFilters, [""]);

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


    // const [date, setDate] = useState(new Date(1598051730000));
    // const [mode, setMode] = useState('date');
    // const [show, setShow] = useState(false);
    const [year, setYear] = useState<number | undefined>();
    const [month, setMonth] = useState<number | undefined>();
    const [date, setDate] = useState<number | undefined>();
    const [errorMessage, setErrorMessage] = useState<string>('');


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

    if (year && month && date && gymExperience && gender && bio && validateDate(year, month, date)) {
  //          await updateDB(userCredential);



            console.log("email is ", email);
            console.log("password is", password);
            console.log("name is" + name as string);
            if (email && password) {
              const userCredential = await CreateUser(email as string, password as string);
              const user = userCredential.user;
              await AddUserToDB(userCredential, name as string, bio, gender, gymExperience, year, month, date);

            } else {
              Alert.alert("Error", "User cannot be properly stored in firestore database."); 
      
            }
         
        
            router.navigate({
              pathname: "LogIn"

            });
        }   
        else {
          Alert.alert("Error", "Please fill in valid fields");
          }

        
        }


        const validateDate = (year: number | undefined, month: number | undefined, date: number | undefined): boolean => {
          if (year === undefined || month === undefined || date === undefined) {
            return false; // Incomplete date, validation failed
          }
        
          // Check if the year is valid (e.g., within a reasonable range)
          if (year < 1900 || year > new Date().getFullYear()) {
            return false; // Invalid year
          }
        
          // Check if the month is valid (between 1 and 12)
          if (month < 1 || month > 12) {
            return false; // Invalid month
          }
        
          // Check if the date is valid for the given month and year
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          if (date < 1 || date > lastDayOfMonth) {
            return false; // Invalid date
          }
        
          return true; // Date is valid
        };
        
        // Function to handle input change and validate the date
        const handleDateChange = (text: string, setState: React.Dispatch<React.SetStateAction<number | undefined>>) => {
          if (text === '') {
            setState(undefined); // If the input is empty, set the state to undefined
            setErrorMessage(''); // Clear error message
            return;
          }
          const value = parseInt(text);
          setState(value);
        
          // If any of the date components are not valid, show error message
          // if (!validateDate(year, month, date)) {
          //   setErrorMessage('Please enter a valid date');
          // } else {
          //   setErrorMessage(''); // Clear error message if date is valid
          // }
        };
        
    

        const theme = extendTheme({
          colors: {
            primary: {
            50: '#7C2D12',
            100: '#F97316',
            200: "#171717",
            300: "#FAFAFA"
            },
          },
          components: {
            Button: {
              baseStyle: {
                color: "primary.50",
                rounded: "full",
              },
            },
            Text: {
              fontSize:"50",
              fontFamily:"Roberto",
              color: "primary.50"
            }
          },
        });
      


    return (
    <NativeBaseProvider theme={theme}>
       <HStack px="5" py="10" justifyContent="flex-start" alignItems="center" w="100%" bg="primary.300">
        <HStack alignItems="center" flex={1}>
          <Button bg="primary.300" startIcon={<ChevronLeftIcon size="md" color="primary.200"/>} onPress={() => router.navigate("SignUp")}></Button>

          <Text fontSize="20" fontWeight="bold" textAlign="center" flex="1" color="primary.200" mr="4" p="2">
            Registration
          </Text>
        </HStack>
        </HStack>



        <SafeAreaView style= {{ flex: 1, backgroundColor: "#FFF" }}>
        <ScrollView backgroundColor={"#FFFFFF"} contentContainerStyle={{ flexGrow: 1 }}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"} flex="1 ">


  
            <Text fontSize="28" fontFamily="Roberto" fontWeight="700" color="primary.50" lineHeight="28" p="3">Create your profile</Text>
  
            <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20"letterSpacing="0.25" p="3" mt="1">Your Birthday</Text>

            <Box alignItems="left" flexDirection="row">
            
               <Input mx="3" w="25%" 
               value={year !== undefined ? year.toString() : ''} 
               onChangeText={text => handleDateChange(text, setYear)}
               keyboardType="numeric" 
               placeholder="Year"/>

               <Input mx="3" w="25%" 
               value={month !== undefined ? month.toString() : ''} 
               onChangeText={text => handleDateChange(text, setMonth)}
               keyboardType="numeric"  
               placeholder="Month"/>

               <Input mx="3" w="27%"   
               value={date !== undefined ? date.toString() : ''}  
               onChangeText={text => handleDateChange(text, setDate)}
               keyboardType="numeric"  
               placeholder="Date"/>


            </Box>

            <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20"letterSpacing="0.25" p="3" mt="3">Gender</Text>

            <Box mx="3" w="90%">
              <Select selectedValue={gender} minWidth="200" accessibilityLabel="Choose Gender" placeholder="Gender" _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }} mt={1} onValueChange={itemValue => setGender(itemValue)}>
                <Select.Item label="Male" value="male" />
                <Select.Item label="Female" value="female" />
                <Select.Item label="Other" value="other" />
              </Select>
            </Box>


            <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20"letterSpacing="0.25" p="3" mt="3">Gym Experience</Text>

            <Box mx="3" w="90%">
              <Select selectedValue={gymExperience} minWidth="200" accessibilityLabel="Choose Gym Experience" placeholder="Gym Experience" _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }} mt={1} onValueChange={itemValue => setGymExperience(itemValue)}>
                <Select.Item label="Beginner" value="beginner" />
                <Select.Item label="Intermediate" value="intermediate" />
                <Select.Item label="Advanced" value="advanced" />
              </Select>
            </Box>


          <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20"letterSpacing="0.25" p="3" mt="3">Bio</Text>

          <Box alignItems="left">

            <Input mx="3" w="90%" value = {bio} onChangeText={setBio} h={100} multiline />

          </Box>

          {errorMessage ? <Text fontSize="16" fontFamily="Roberto" fontWeight="400" color="primary.50" lineHeight="20"letterSpacing="0.25" p="3" mt="3">
               {errorMessage}
              </Text> : null}

                    


            <Flex direction="column" flexGrow="1" justifyContent="flex-end">

            <Button bg="primary.100" onPress={finishSignUp} > Next Step </Button>
         
            </Flex>
            </Box>
        </ScrollView>
      </SafeAreaView>
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
