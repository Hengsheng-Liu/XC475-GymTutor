import { useState, useEffect } from "react";
import {
  NativeBaseProvider,
  Select,
  Box,
  CheckIcon,
  Flex,
  Pressable,
  Input,
  Button,
  ChevronLeftIcon,
  Text,
  Badge,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import Tags from "../../components/ProfileComponents/Tags";
import { Alert, View, SafeAreaView } from "react-native";
import { firestore } from "../../firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { UserCredential } from "firebase/auth";
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { addUser } from "@/components/FirebaseUserFunctions";
import { Filters, defaultFilters } from "@/app/(tabs)/(HomePage)/Filter";
import DateTimePicker from "@react-native-community/datetimepicker";
import theme from "@/components/theme";

export const AddUserToDB = async (
  response: UserCredential,
  name: string,
  bio: string,
  gender: string,
  gymExperience: string,
  year: number,
  month: number,
  date: number,
  tags: string[]
) => {
  const user = response.user;

  await addUser(
    user.uid,
    user.email || "",
    "",
    "",
    name,
    21,
    bio,
    gender,
    "",
    gymExperience,
    { day: date, month: month, year: year },
    defaultFilters,
    tags
  );
};

export default function SignUpScreen22() {

  const { CreateUser } = useAuth();
  const emptyData = [];
  const { name, email, password } = useLocalSearchParams();
  const [month, setMonth] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [pickerDate, setPickerDate] = useState(new Date());
  const [gymExperience, setGymExperience] = useState<string>("");
  const [gender, setGender] = useState<string | undefined>();
  const [bio, setBio] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: boolean }>(
    {}
  );
  const WhoAreYouTags = ["Wellness Guru", "Early Riser", "Adventurer", "Foodie", "Gym Rat", "Busy Bee", "Group Fitness Fan"]
  const FitnessGoalTags = [
    "Muscle mass",
    "Bulking",
    "Strength",
    "Aesthetics",
  ];
  const ActivitiesTags = ["Basic", "Powerlifting", "Cardio", "Recreational"];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setPickerDate(currentDate);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prevTags) => ({
      ...prevTags,
      [tag]: !prevTags[tag],
    }));
  };

  useEffect(() => {
    const activeTags = Object.keys(selectedTags).filter(key => selectedTags[key]);
    setTags(activeTags);

  }, [selectedTags]);

  const checkWords = (text: string) => {
    const charCount = text.trim().length; // Trim to remove leading/trailing whitespace and count characters
    if (charCount <= 200) {
      return true;
    } else {
      // Provide feedback to the user when the character limit is exceeded
      alert("Please make sure your bio is under 200 characters.");
      return false;
    }
  };


  const finishSignUp = async () => {
    try {
      const year = pickerDate.getFullYear();
      const month = pickerDate.getMonth();
      const day = pickerDate.getDate();

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();

      // Calculate age
      let age = currentYear - year;
      if (currentMonth < month || (currentMonth === month && currentDay < day)) {
        age--; // Subtract a year if the current date is before the birth date
      }

      if (age < 18) {
        Alert.alert("Error", "You must be at least 18 years old.");
        return;
      }

      if (tags.length == 0) {
        Alert.alert("Select at least 1 tag to get started");
        return;
      }

      // Function to check tags count from each category
      const checkCategoryTags = (categoryTags) => tags.filter(tag => categoryTags.includes(tag)).length <= 1;

      // Verify each category has at most one tag
      const isValidFitnessGoal = checkCategoryTags(FitnessGoalTags);
      const isValidActivity = checkCategoryTags(ActivitiesTags);
      const isValidWorkoutTime = checkCategoryTags(WhoAreYouTags);

      if (!isValidFitnessGoal || !isValidActivity || !isValidWorkoutTime) {
        Alert.alert("Error", "You can select at most one tag from each category.");
        return;
      }

      if (year && month && day && gymExperience && gender && bio && tags && checkWords(bio)) {
        if (email && password) {
          const userCredential = await CreateUser(
            email as string,
            password as string
          ); // Assuming CreateUser is a function that handles Firebase auth.
          const user = userCredential.user;
          await AddUserToDB(
            userCredential,
            name as string,
            bio,
            gender,
            gymExperience,
            year,
            month,
            day,
            tags
          ); // Assuming this function adds the user details to your Firestore.

          router.replace("/LoadingPage");
        } else {
          Alert.alert(
            "Error",
            "User cannot be properly stored in Firestore database."
          );
        }
      } else {
        console.log("Please ensure all fields are correctly filled.");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      Alert.alert("Error", "Failed to complete the registration process.");
    }
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Flex
          flexDir={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable
            padding={"2"}
            onPress={() => router.back()}
            _pressed={{ opacity: 0.5 }}
          >
            <ChevronLeftIcon size="md" color="#171717" />
          </Pressable>
          <Text
            fontSize="20"
            fontWeight="bold"
            textAlign="center"
            flex="1"
            mr="10"
            p="2"
          >
            Registration
          </Text>
        </Flex>
        <Box ml={"3"} mr={"3"} flex="1 ">
          <Text
            fontSize="28"
            fontWeight="700"
            lineHeight="28"
            p="3"
          >
            Create your profile
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2, marginTop: 8 }}>
            <Text
              fontSize="16"
              fontWeight="400"
              lineHeight="20"
              letterSpacing="0.25"
              p="3"
              mt="1"
              marginRight="-4" // Adjust spacing between text and date picker
            >
              Your Birthday
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              ml={1}
              mr={3}
            >
              <DateTimePicker
                testID="dateTimePicker"
                value={pickerDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            </Box>
          </View>


          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingX={6}
            ml={-1.5}
          ></Box>

          <Text
            fontSize="16"
            fontWeight="400"
            lineHeight="20"
            letterSpacing="0.25"
            p="3"
            mt="3"
          >
            Gender
          </Text>

          <Box mx="3" w="90%">
            <Select
              selectedValue={gender}
              minWidth="200"
              accessibilityLabel="Choose Gender"
              placeholder="Gender"
              _selectedItem={{
                bgColor: "#fac8a2",
              }}
              mt={1}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Select.Item label="Male" value="male" />
              <Select.Item label="Female" value="female" />
              <Select.Item label="Other" value="other" />
            </Select>
          </Box>

          <Text
            fontSize="16"
            fontWeight="400"
            lineHeight="20"
            letterSpacing="0.25"
            p="3"
            mt="3"
          >
            Gym Experience
          </Text>

          <Box mx="3" w="90%">
            <Select
              selectedValue={gymExperience}
              minWidth="200"
              accessibilityLabel="Choose Gym Experience"
              placeholder="Gym Experience"
              _selectedItem={{
                bg: "#fac8a2"
              }}
              mt={1}
              onValueChange={(itemValue) => setGymExperience(itemValue)}
            >
              <Select.Item label="Beginner" value="beginner" />
              <Select.Item label="Intermediate" value="intermediate" />
              <Select.Item label="Advanced" value="advanced" />
            </Select>
          </Box>

          <Text
            fontSize="16"
            fontWeight="400"
            lineHeight="20"
            letterSpacing="0.25"
            p="3"
            mt="3"
          >
            Bio
          </Text>

          <Box alignItems="left" overflow="wrap">
            <Input
              mx="3"
              w="90%"
              value={bio}
              h="50"
              overflow={"wrap"}
              flexWrap={"wrap"}
              numberOfLines={3}
              onChangeText={(text) => setBio(text)}
              multiline={false}
              placeholder="Create a bio! (200 characters max)"
              _focus={{
                borderColor: "#F97316",  // Change to your preferred color
                backgroundColor: "white", // Change background color on focus
              }}
            />
          </Box>

          <Flex flexDirection="column" mt={3} px="3">
            <Flex flexDirection="column" mt={3}>
              <Text fontSize="md" m={1}>
                Fitness Goals:
              </Text>
              <Flex
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-evenly"
              >
                {FitnessGoalTags.map((tag, index) => (
                  <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                    <Badge
                      m={2}
                      ml={0}
                      backgroundColor={selectedTags[tag] ? "#fac8a2" : "white"}
                      shadow={1}
                      borderRadius={4}
                    >
                      {tag}
                    </Badge>
                  </Pressable>
                ))}
              </Flex>
              <Text fontSize="md" m={1}>
                Activities:
              </Text>
              <Flex
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-evenly"
              >
                {ActivitiesTags.map((tag, index) => (
                  <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                    <Badge
                      m={2}
                      ml={0}
                      backgroundColor={selectedTags[tag] ? "#fac8a2" : "white"}
                      shadow={1}
                      borderRadius={4}
                    >
                      {tag}
                    </Badge>
                  </Pressable>
                ))}
              </Flex>
              <Text fontSize="md" m={1}>
                Who Are You?:
              </Text>
              <Flex
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-evenly"
              >
                {WhoAreYouTags.map((tag, index) => (
                  <Pressable key={tag} onPress={() => handleToggleTag(tag)}>
                    <Badge
                      m={2}
                      ml={0}
                      backgroundColor={selectedTags[tag] ? "#fac8a2" : "white"}
                      shadow={1}
                      borderRadius={4}
                    >
                      {tag}
                    </Badge>
                  </Pressable>
                ))}
              </Flex>
            </Flex>
            <Flex alignItems={"center"}>
              <Button
                mt={10}
                background={"#F97316"}
                _pressed={{ opacity: 0.5 }}
                onPress={finishSignUp}
                rounded="md"
                height={"12"}
                width={"95%"}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        </Box>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
