import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from "@/Context/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeBaseProvider, Spacer, Flex, AlertDialog, Pressable, Box, Row, Text, Heading, View, Button, Checkbox} from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { getCurrUser } from '@/components/FirebaseUserFunctions';
import theme from '@/components/theme';
import { router } from "expo-router";

import { FontAwesome } from "@expo/vector-icons";


const defaultValues = {ageRange: [18, 100], gymExperience: ["beginner", "intermediate", "advanced"], sex: ["male", "female"]};

export type Filters = {
  applyFilters: boolean[]; // Save which filters are to be applied. 0: All, 1: Age, 2: Sex, 3: Gym Experience
  age: number[]; // Save age range: 0: Min, 1: Max
  sex: string[]; // Male / Female
  gymExperience: string[]; // Options: Beginner, Intermediate, Advanced
};

export const defaultFilters: Filters = { 
  applyFilters: [false, false, false, false],
  age: defaultValues.ageRange,
  sex: defaultValues.sex,
  gymExperience: defaultValues.gymExperience
};

const FilterScreen = () => {
    const { User, currUser, updateCurrUser, userFilters, updateFilters } = useAuth();
    const db = firestore;
    if (!User) return;
    if (!currUser) return;

    const [filters, setFilters] = useState<Filters>(currUser.filters); // stores the filters of the user

    const [male, setMale] = useState<boolean>(filters.sex.includes("male")); // stores whether male box is checked
    const [female, setFemale] = useState<boolean>(filters.sex.includes("female")); // stores whether female box is checked

    const [beginner, setBeginner] = useState<boolean>(filters.gymExperience.includes("beginner")); // stores whether beginner box is checked
    const [intermediate, setIntermediate] = useState<boolean>(filters.gymExperience.includes("intermediate")); // stores whether intermediate box is checked
    const [advanced, setAdvanced] = useState<boolean>(filters.gymExperience.includes("advanced")); // stores whether advanced box is checked
    const experienceLevels = [
      { level: "beginner", value: beginner },
      { level: "intermediate", value: intermediate },
      { level: "advanced", value: advanced }
    ];

    const [ageRange, setAgeRange] = useState(filters.age);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [applyNewFilters, setApplyNewFilters] = useState(filters.applyFilters[0]);

  // Update filters of user
  const updateUserFilters = async (filters: Filters) => {
    updateFilters(filters);
    if (currUser){    
      const updatedUser = { ...currUser };
      updatedUser.filters = filters;
      updateCurrUser(updatedUser);
    }
    const userDocRef = doc(db, "Users", User.uid);
    updateDoc(userDocRef, {filters: filters});
  };

  // Retrieve new filters and save them to the user
  const checkChanges = (): [boolean, Filters] => {
    let applyFilters = [false, false, false, false];
    let madeChanges = false;

    let sex = filters.sex;
    let gymExperience = filters.gymExperience;
    let [minAge, maxAge] = filters.age;

    let newSex = defaultValues.sex;
    let newExperience = defaultValues.gymExperience;
    let [newMinAge, newMaxAge] = defaultValues.ageRange;

    // Check if it's necessary to filter by sex
    if ((male && female) || (!male && !female)) {
      applyFilters[1] = false;
    } else {
      applyFilters[1] = true;
      newSex = male? ["male"] : ["female"];
    };

    // Check if there were any changes in sex selection
    if (!(sex.length === newSex.length && sex.every((sex, index) => newSex.includes(sex)))) {
      madeChanges = true;
    };

    // Check if it's necessary to filter by age
    if (ageRange[0] === newMinAge && ageRange[1] === newMaxAge) {
      applyFilters[2] = false;
    } else { 
      applyFilters[2] = true;
      [newMinAge, newMaxAge] = ageRange;
    };

    // Check if there were any changes in age range selection
    if (!(minAge === newMinAge && maxAge === newMaxAge)) {
      madeChanges = true;
    };

    // Check if it's necessary to filter by experience
    if ((beginner && intermediate && advanced) || (!beginner && !intermediate && !advanced)) {
      applyFilters[3] = false;
    } else {
      applyFilters[3] = true;
      newExperience = experienceLevels
        .filter(level => level.value)
        .map(level => level.level);
    };
    
    // Check if there were any changes in gym experience selection
    if (!(gymExperience.length === newExperience.length && gymExperience.every((level, index) => newExperience.includes(level)))) {
      madeChanges = true;
    }

    // Check if it's necessary to filter
    if ((beginner && intermediate && advanced) || (!beginner && !intermediate && !advanced)) {
      applyFilters[3] = false;
    } else {
      applyFilters[3] = true;
      newExperience = experienceLevels
        .filter(level => level.value)
        .map(level => level.level);
    };
    
    // Check if there were any changes in gym experience selection
    if (!(gymExperience.length === newExperience.length && gymExperience.every((level, index) => newExperience.includes(level)))) {
      madeChanges = true;
    }

    // Check if it's necessary to apply filters
    if (!applyFilters[1] && !applyFilters[2] && !applyFilters[3]) {
      applyFilters[0] = false;
    } else {
      // Check if there were any changes in apply filters selection
      if (applyNewFilters !== filters.applyFilters[0]) {
        madeChanges = true;
      }
      applyFilters[0] = applyNewFilters;
    }

  // If the filters have changed, update the user's filters
  if (madeChanges) {
    // Create filter object with updated filters
    const newFilters: Filters = {
      applyFilters: [applyFilters[0], applyFilters[1], applyFilters[2], applyFilters[3]],
      age: [ageRange[0], ageRange[1]],
      sex: newSex,
      gymExperience: newExperience
    };
  
    return [madeChanges, newFilters];
  }
    return [false, filters]; // No changes were made so return same filters
  };
  
  // Apply filters to the user
  const applyChanges = async (newFilters: Filters) => {
    // Save new filters to the user
    await updateUserFilters(newFilters);
  };

  // Save user filters if changes were made
  const handleSaveChanges = () => {
    let [changed, newFilters] = checkChanges();
    if (changed) {
      applyChanges(newFilters);
    };
    router.back();
  };

  // Handle navigation. Ask user if they want to save changes before leaving
  const handleGoBack = () => {
    let [changed, newFilters] = checkChanges();
    if (changed) {
      setDialogOpen(true);
    } else {
      router.back();
    }
  };

  // Reset filters to default values
  const handleResetFilters = () => {
    setDefault();
    applyChanges(defaultFilters); // Filters are off by default
  };

  // Helper function for resetting filters. Set default filters for all values
  const setDefault = () => {
    setFilters(defaultFilters);
    setMale(true);
    setFemale(true);
    setBeginner(true);
    setIntermediate(true);
    setAdvanced(true);
    setAgeRange(defaultValues.ageRange);
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Save user filters
  const handleSaveFilters = () => {
    let [changed, newFilters] = checkChanges();
    if(changed){
      applyChanges(newFilters);
    }
    router.back();
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={{backgroundColor:"#FFF", flex: 1}}>
      <Box p={15} alignItems="center">
            <Flex flexDirection={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleGoBack()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Spacer/>
              <Box>
                <Heading fontSize="lg" color="black" pl="3"> Filters</Heading> 
              </Box>
              <Spacer/>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleResetFilters()} >
                <Text color="black" fontSize="md" fontWeight="bold">Reset</Text>
              </TouchableOpacity>
            </Flex>
          </Box>
        <ScrollView style={{flex:1, backgroundColor:"#FFF"}}>
        <View bgColor="#FFF" flex={1} paddingLeft={15} paddingRight={15} >
          <Heading pt={2} pb={4} fontSize="lg" color="trueGray.700">Basic Information</Heading>
          <Text pt={3} pb={3} fontSize="md">Sex </Text>
          <Row justifyContent="space-evenly">
            <Checkbox 
              value="male"
              isChecked={male}
              defaultIsChecked={male}
              colorScheme="orange"
              onChange={() => setMale(!male)}>Male</Checkbox>
            <Checkbox 
              value="female"
              isChecked={female}
              defaultIsChecked={female}
              colorScheme="orange"
              onChange={() => setFemale(!female)}>Female</Checkbox>
          </Row>
          <Row justifyContent={'left'} pt={5}>
            <Text fontSize="md">Age </Text>
            <Spacer/>
            <Text>{ageRange[0]} - {ageRange[1]}</Text>
          </Row>
          <Spacer/>
          <Row justifyContent={"center"} pt={3} >
          <MultiSlider
            values={ageRange}
            onValuesChange={(values) => setAgeRange(values)}
            min={18}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            selectedStyle= {{backgroundColor: "#F97316"}}
          />
        </Row>
          <Text pt={4} pb={5} fontSize="md">Experience Level </Text>
          <Row justifyContent="space-evenly" pt={3}>
            <Checkbox 
              value="beginnner"
              isChecked={beginner}
              defaultIsChecked={beginner}
              colorScheme="orange"
              onChange={() => setBeginner(!beginner)}>Beginner</Checkbox>
            <Checkbox 
              value="intermediate"
              isChecked={intermediate}
              defaultIsChecked={intermediate}
              colorScheme="orange"
              onChange={() => setIntermediate(!intermediate)}>Intermediate</Checkbox>
            <Checkbox 
              value="advanced"
              isChecked={advanced}
              defaultIsChecked={advanced}
              colorScheme="orange"
              onChange={() => setAdvanced(!advanced)}>Advanced</Checkbox>
          </Row>
          <Spacer/>
        </View>
        </ScrollView>
        <View style={{ flex: 1, backgroundColor: "#FFF", paddingLeft:15, paddingRight:15, paddingBottom:15, justifyContent: "flex-end"}}>
            <Checkbox 
              value="applyNewFilters"
              isChecked={applyNewFilters}
              defaultIsChecked={applyNewFilters}
              colorScheme="orange"
              onChange={() => setApplyNewFilters(!applyNewFilters)}> Check to apply filters
            </Checkbox>
          <Button onPress={handleSaveChanges} mt="2" backgroundColor="#F97316" _pressed={{ opacity: 0.4 }}>
            <Text color="#FFF" fontWeight="bold">Save Changes</Text>
          </Button>
          </View>
      </SafeAreaView>
      <AlertDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        leastDestructiveRef={React.useRef(null)}
        size="md"
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Save Changes</AlertDialog.Header>
          <AlertDialog.Body>
            Do you want to save the changes before leaving?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button bgColor="#0284C7" onPress={handleCloseDialog}>Cancel</Button>
              <Button bgColor="#0284C7" onPress={() => router.back()}> Do not save </Button>
              <Button bgColor="#0284C7" onPress={handleSaveFilters}> Save </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </NativeBaseProvider>
  );
};

export default FilterScreen;
