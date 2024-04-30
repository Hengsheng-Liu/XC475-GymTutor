import { useState, useEffect } from "react";
import {
  NativeBaseProvider, Select, Box, CheckIcon, Flex, Pressable, Input, Button, extendTheme,
  ChevronLeftIcon,
  HStack,
  Icon,
  Text,
  ScrollView,
  Badge,
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
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { useRoute } from '@react-navigation/native';
import { addUser } from "@/components/FirebaseUserFunctions"
import { Filters, defaultFilters } from '@/app/(tabs)/(HomePage)/Filter';


export const AddUserToDB = async (response: UserCredential, name: string, bio: string, gender: string, gymExperience: string, year: number, month: number, date: number, tags: string[]) => {
  const user = response.user;

  await addUser(user.uid, user.email || "", "", "", name, 21, bio, gender, "", gymExperience, { day: date, month: month, year: year }, defaultFilters, tags);

};

// interface RouteParams {
//   email: string;
//   password: string;
// }

export default function SignUpScreen2() {
  const { CreateUser } = useAuth();

  // const route = useRoute();
  // const { email, password } = route.params as RouteParams;

  const { name, email, password } = useLocalSearchParams();


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
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: boolean }>({});
  const [FitnessGoalTags] = useState(['Muscle mass', 'Bulking', 'Strength', 'Aesthetics']);
  const [ActivitiesTags] = useState(['Basic', 'Powerlifting', 'Cardio']);
  const [WorkoutTimeTags] = useState(['Morning', 'Afternoon', 'Night']);
  const [selected1, setSelected1] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [selected3, setSelected3] = useState(false);
  const [selected4, setSelected4] = useState(false);
  const [selected5, setSelected5] = useState(false);
  const [selected6, setSelected6] = useState(false);
  const [selected7, setSelected7] = useState(false);
  const [selected8, setSelected8] = useState(false);
  const [selected9, setSelected9] = useState(false);
  const [selected10, setSelected10] = useState(false);



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


  const handleToggleTag = (tag) => {
    setSelectedTags(prevTags => ({
      ...prevTags,
      [tag]: !prevTags[tag] // Toggle the boolean value for the tag
    }));
  };


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
  const checkWords = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length; // Split by spaces, filter out empty strings
    if (wordCount <= 50) {
      return true;
    } else {
      // Optionally, you can provide feedback to the user when the word limit is reached.
      alert('You have reached the maximum word limit of 50 words.');
      return false
    }
  };
  const finishSignUp = async () => {


    console.log("email is ", email);
    console.log("password is", password);
    console.log("name is" + name as string);

    if (year && month && date && gymExperience && gender && bio && validateDate(year, month, date) && tags) {
      //          await updateDB(userCredential);



      console.log("email is ", email);
      console.log("password is", password);
      console.log("name is" + name as string);
      if (email && password && checkWords(bio)) {
        setTags(selectedTags);
        const userCredential = await CreateUser(email as string, password as string);
        const user = userCredential.user;
        await AddUserToDB(userCredential, name as string, bio, gender, gymExperience, year, month, date, tags);

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
        300: "#FAFAFA",
        400: "#FFFFFF"

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
        fontSize: "50",
        color: "primary.50"
      }
    },
  });


  return (
    <NativeBaseProvider theme={theme}>
      <HStack px="5" mt="1" py="10" justifyContent="space-between" alignItems="center" w="100%" bg="primary.400">


        <Button bg="primary.400" startIcon={<ChevronLeftIcon size="md" color="primary.200" />} onPress={() => router.navigate("LogIn")}></Button>
        <Text fontSize="20" fontWeight="bold" textAlign="center" flex="1" color="primary.200" mr="10" p="2">
          Registration
        </Text>

      </HStack>



      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <ScrollView backgroundColor={"#FFFFFF"} contentContainerStyle={{ flexGrow: 1 }}>
          <Box ml={"3"} mr={"3"} paddingTop={"10"} flex="1 ">



            <Text fontSize="28" fontWeight="700" color="primary.200" lineHeight="28" p="3">Create your profile</Text>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="1">Your Birthday</Text>

            <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingX={6} ml={-1.5}>

              <Select
                selectedValue={year?.toString()}
                minWidth="100"
                accessibilityLabel="Choose Year"
                placeholder="Year"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setYear(parseInt(itemValue))}
              >
                <Select.Item label="2023" value="2023" />
                <Select.Item label="2022" value="2022" />
                <Select.Item label="2021" value="2021" />
                <Select.Item label="2020" value="2020" />
                <Select.Item label="2019" value="2019" />
                <Select.Item label="2018" value="2018" />
                <Select.Item label="2017" value="2017" />
                <Select.Item label="2016" value="2016" />
                <Select.Item label="2015" value="2015" />
                <Select.Item label="2014" value="2014" />
                <Select.Item label="2013" value="2013" />
                <Select.Item label="2012" value="2012" />
                <Select.Item label="2011" value="2011" />
                <Select.Item label="2010" value="2010" />
                <Select.Item label="2009" value="2009" />
                <Select.Item label="2008" value="2008" />
                <Select.Item label="2007" value="2007" />
                <Select.Item label="2006" value="2006" />
                <Select.Item label="2005" value="2005" />
                <Select.Item label="2004" value="2004" />
                <Select.Item label="2003" value="2003" />
                <Select.Item label="2002" value="2002" />
                <Select.Item label="2001" value="2001" />
                <Select.Item label="2000" value="2000" />
                <Select.Item label="1999" value="1999" />
                <Select.Item label="1998" value="1998" />
                <Select.Item label="1997" value="1997" />
                <Select.Item label="1996" value="1996" />
                <Select.Item label="1995" value="1995" />
                <Select.Item label="1994" value="1994" />
                <Select.Item label="1993" value="1993" />
                <Select.Item label="1992" value="1992" />
                <Select.Item label="1991" value="1991" />
                <Select.Item label="1990" value="1990" />
                <Select.Item label="1989" value="1989" />
                <Select.Item label="1988" value="1988" />
                <Select.Item label="1987" value="1987" />
                <Select.Item label="1986" value="1986" />
                <Select.Item label="1985" value="1985" />
                <Select.Item label="1984" value="1984" />
                <Select.Item label="1983" value="1983" />
                <Select.Item label="1982" value="1982" />
                <Select.Item label="1981" value="1981" />
                <Select.Item label="1980" value="1980" />
                <Select.Item label="1979" value="1979" />
                <Select.Item label="1978" value="1978" />
                <Select.Item label="1977" value="1977" />
                <Select.Item label="1976" value="1976" />
                <Select.Item label="1975" value="1975" />
                <Select.Item label="1974" value="1974" />
                <Select.Item label="1973" value="1973" />
                <Select.Item label="1972" value="1972" />
                <Select.Item label="1971" value="1971" />
                <Select.Item label="1970" value="1970" />
                <Select.Item label="1969" value="1969" />
                <Select.Item label="1968" value="1968" />
                <Select.Item label="1967" value="1967" />
                <Select.Item label="1966" value="1966" />
                <Select.Item label="1965" value="1965" />
                <Select.Item label="1964" value="1964" />
                <Select.Item label="1963" value="1963" />
                <Select.Item label="1962" value="1962" />
                <Select.Item label="1961" value="1961" />
                <Select.Item label="1960" value="1960" />
                <Select.Item label="1959" value="1959" />
                <Select.Item label="1958" value="1958" />
                <Select.Item label="1957" value="1957" />
                <Select.Item label="1956" value="1956" />
                <Select.Item label="1955" value="1955" />
                <Select.Item label="1954" value="1954" />
              </Select>
              {/* Month Select */}
              <Select
                selectedValue={month?.toString()}
                minWidth="100"
                accessibilityLabel="Choose Month"
                placeholder="Month"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setMonth(parseInt(itemValue))}
              >
                <Select.Item label="January" value="1" />
                <Select.Item label="February" value="2" />
                <Select.Item label="March" value="3" />
                <Select.Item label="April" value="4" />
                <Select.Item label="May" value="5" />
                <Select.Item label="June" value="6" />
                <Select.Item label="July" value="7" />
                <Select.Item label="August" value="8" />
                <Select.Item label="September" value="9" />
                <Select.Item label="October" value="10" />
                <Select.Item label="November" value="11" />
                <Select.Item label="December" value="12" />
              </Select>

              {/* Date Select */}
              <Select
                selectedValue={date?.toString()}
                minWidth="100"
                accessibilityLabel="Choose Date"
                placeholder="Date"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setDate(parseInt(itemValue))}
              >
                <Select.Item label="1" value="1" />
                <Select.Item label="2" value="2" />
                <Select.Item label="3" value="3" />
                <Select.Item label="4" value="4" />
                <Select.Item label="5" value="5" />
                <Select.Item label="6" value="6" />
                <Select.Item label="7" value="7" />
                <Select.Item label="8" value="8" />
                <Select.Item label="9" value="9" />
                <Select.Item label="10" value="10" />
                <Select.Item label="11" value="11" />
                <Select.Item label="12" value="12" />
                <Select.Item label="13" value="13" />
                <Select.Item label="14" value="14" />
                <Select.Item label="15" value="15" />
                <Select.Item label="16" value="16" />
                <Select.Item label="17" value="17" />
                <Select.Item label="18" value="18" />
                <Select.Item label="19" value="19" />
                <Select.Item label="20" value="20" />
                <Select.Item label="21" value="21" />
                <Select.Item label="22" value="22" />
                <Select.Item label="23" value="23" />
                <Select.Item label="24" value="24" />
                <Select.Item label="25" value="25" />
                <Select.Item label="26" value="26" />
                <Select.Item label="27" value="27" />
                <Select.Item label="28" value="28" />
                <Select.Item label="29" value="29" />
                <Select.Item label="30" value="30" />
                <Select.Item label="31" value="31" />
              </Select>


            </Box>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Gender</Text>

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


            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Gym Experience</Text>

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


            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3">Bio</Text>

            <Box alignItems="left">

              <Input mx="3" w="90%" value={bio} h="100" onSubmitEditing={() => setBio} multiline={true} placeholder="Maximum 50 words" />

            </Box>

            <Text fontSize="16" fontWeight="400" color="primary.200" lineHeight="20" letterSpacing="0.25" p="3" mt="3"> What kind of gym goer are you? </Text>


            <Flex flexDirection="column" mt={3} px="3">



              <Flex flexDirection="column" mt={3}>
                <Text fontSize="md" mb={1}>Fitness Goals:</Text>
                <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                  <Pressable key={FitnessGoalTags[0]} onPress={() => setSelected1(prev => !prev)}>
                    <Badge
                      m={2}
                      ml={0}
                      colorScheme={selected1 ? "primary.100" : "muted"}
                      shadow={1}
                      borderRadius={4}
                    >
                      {FitnessGoalTags[0]}
                    </Badge>
                  </Pressable>

                  {FitnessGoalTags.map((tag, index) => (
                    <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                      <Badge
                        m={2}
                        ml={0}
                        colorScheme={selectedTags[tag] ? "primary.100" : "muted"}
                        shadow={1}
                        borderRadius={4}
                      >
                        {tag}
                      </Badge>
                    </Pressable>
                  ))}
                </Flex>
                <Text fontSize="md" mb={1}>Activities:</Text>
                <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                  {ActivitiesTags.map((tag, index) => (
                    <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                      <Badge
                        m={2}
                        ml={0}
                        colorScheme={selectedTags[tag] ? "primary.100" : "muted"}
                        shadow={1}
                        borderRadius={4}
                      >
                        {tag}
                      </Badge>
                    </Pressable>
                  ))}
                </Flex>
                <Text fontSize="md" mb={1}>Preferred Workout Times:</Text>
                <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                  {WorkoutTimeTags.map((tag, index) => (
                    <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                      <Badge
                        m={2}
                        ml={0}
                        colorScheme={selectedTags[tag] ? "primary.100" : "muted"}
                        shadow={1}
                        borderRadius={4}
                      >
                        {tag}
                      </Badge>
                    </Pressable>
                  ))}
                </Flex>
              </Flex>


            </Flex>


            {errorMessage ? <Text fontSize="16" fontWeight="400" color="primary.50" lineHeight="20" letterSpacing="0.25" p="3" mt="3">
              {errorMessage}
            </Text> : null}




            <Flex direction="column" flexGrow="1" justifyContent="flex-end">

              <Button mt="3" background="#F97316" _pressed={{ opacity: 0.5 }} onPress={finishSignUp} rounded="md" > Next Step </Button>

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
