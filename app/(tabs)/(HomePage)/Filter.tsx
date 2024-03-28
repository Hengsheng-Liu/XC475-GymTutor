import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider, Spacer } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Slider, Row, Text, View, Button, Select, Input, Radio, Checkbox} from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import FriendContainer from "@/components/FriendsComponents/FriendContainer";
import fetchUsers from "@/components/FriendsComponents/FetchUsers";
import { getCurrUser } from '@/components/FirebaseUserFunctions';
import theme from '@/components/theme';
import { router } from "expo-router";
import Header from "@/components/FilterComponents/Header";

const defaultValues = {ageRange: [18, 100], gymExperience: ["beginner", "intermediate", "advanced"], sex: ["male", "female"]};

export type Filters = {
  applyFilters: boolean[]; // Save which filters are to be applied. 0: All, 1: Age, 2: Sex, 3: Gym Experience
  age: number[]; // Save age range: 0: Min, 1: Max
  sex: string[]; // Male / Female
  gymExperience: string[]; // Options: Beginner, Intermediate, Advanced
}

export const defaultFilters: Filters = { 
  applyFilters: [false, false, false, false],
  age: defaultValues.ageRange,
  sex: defaultValues.sex,
  gymExperience: defaultValues.gymExperience
};

const FilterScreen = () => {
    const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
    const sexOptions = ["Male", "Female"];

    const [sex, setSex] = useState<string[]>(defaultFilters.sex);
    const [box1, setBox1] = useState<boolean>(); // stores whether male box is checked
    const [box2, setBox2] = useState<boolean>(); // stores whether female box is checked

    const [ageRange, setAgeRange] = useState(defaultFilters.age);
    const [gymExperience, setExperience] = useState<string[]>(defaultFilters.gymExperience); 

    // const [otherValue, setOtherValue] = useState('');
    // const [isChecked, setIsChecked] = useState(false);

    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const { User } = useAuth();
    if (!User) return;
    const db = firestore;

    // Initialize filters
    useEffect(() => {
      const fetchFilters = async () => {
        const currUser = await getCurrUser(User.uid);
        const userFilters = currUser.filters;
        
        // If the user doesn't have the field, asign it.
        if (!userFilters) {
          setFilters(defaultFilters);
          updateUserFilters(defaultFilters);
        } else {
          // Initialize the filters
          setFilters(userFilters);
          setSex(userFilters.sex);
          setBox1(userFilters.sex.includes("male"));
          setBox2(userFilters.sex.includes("female"));
          setAgeRange(userFilters.age);
          setExperience(userFilters.gymExperience);
        };
      }
      fetchFilters();
  }, []);

  // Update filters of user
  const updateUserFilters = async (filters: Filters) => {
    const userDocRef = doc(db, "Users", User.uid);
    await updateDoc(userDocRef, {
      filters: filters
    });
    console.log("Updated following filters of user: ", filters);
  };

  // Retrieve new filters and save them to the user
  const checkChanges = (): [boolean, Filters] => {
    let applyFilters = [false, false, false, false];
    let madeChanges = false;
    let newSex = ["male", "female"];
    let newExperience = ["beginner", "intermediate", "advanced"];

    // Check if it's necessary to filter by sex
    if ((box1 && box2) || (!box1 && !box2)) {
      applyFilters[1] = false;
    } else {
      applyFilters[1] = true;
      newSex = box1? ["male"] : ["female"]
    }
    
    console.log("Old sex: ", sex);

    if (!(sex.length === newSex.length && sex.every((sex, index) => newSex.includes(sex)))) {
      madeChanges = true;
      console.log("Made the change in sex: ",sex, newSex);
    }

    console.log(box1, box2, applyFilters[1]);

    // Check if it's necessary to filter by age
    if (ageRange[0] === defaultValues.ageRange[0] && ageRange[1] === defaultValues.ageRange[1]) {
      applyFilters[2] = false;
    } else { 
      applyFilters[2] = true;
      madeChanges = true;
    }

    // Check if it's necessary to filter by gym experience
    if (gymExperience.length === 0 || gymExperience.length === 3) {
      applyFilters[3] = false;
      newExperience = gymExperience;
    } else {
      applyFilters[3] = true;
      madeChanges = true;
    }

  // If the filters have changed, update the user's filters
  if (madeChanges) {
    // Create filter object with updated filters
    const newFilters: Filters = {
      applyFilters: [applyFilters[0], applyFilters[1], applyFilters[2], applyFilters[3]],
      age: [ageRange[0], ageRange[1]],
      sex: newSex,
      gymExperience: gymExperience
    };
    console.log("New filters: ", newFilters);
  
    return [madeChanges, newFilters];
  }
    return [false, filters];
  };
  
  const applyNewFilters = (newFilters: Filters) => {
    // Save new filters to the user
    console.log("Applying new filters: ", newFilters);
    updateUserFilters(newFilters);
  };

  const handleApplyFilters = () => {
    let [changed, newFilters] = checkChanges();
    if (changed) {
      applyNewFilters(newFilters);
    };
    router.push("/Home")

  }

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView style={{backgroundColor: "#FFFF"}}>
        <ScrollView>
        <View style={{ paddingLeft: 15, paddingRight: 15}}>
          <Header/>
          <Text pt={2} pb={2} color= "trueGray.900" fontSize="md" fontWeight="bold">BASIC INFO:</Text>
          <Text pt={2} pb={2} color= "trueGray.900" fontSize="sm">Sex:</Text>
          <Row justifyContent="space-evenly">
            <Checkbox 
              value="male"
              isChecked={box1}
              defaultIsChecked={box1}
              onChange={() => setBox1(!box1)}> Male </Checkbox>
            <Checkbox 
              value="female"
              isChecked={box2}
              defaultIsChecked={box2}
              onChange={() => setBox2(!box2)}> Female </Checkbox>
          </Row>
          <View style={{ flex: 1, justifyContent: 'flex-end'}}>
          <Button onPress={handleApplyFilters} style={{ marginTop: 10  }}>
            Apply Filters
          </Button>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default FilterScreen;

{/* <View>
          <Text>Select Gym Activity:</Text>
          <Select
            selectedValue={gymExperience}
            onValueChange={(value) => setGymExperience(value)}
            placeholder="Select Gym Activity"
          >
            <Select.Item label="Cardio" value="cardio" />
            <Select.Item label="Weightlifting" value="weightlifting" />
            <Select.Item label="Yoga" value="yoga" />
          </Select>
        </View> 
      
      <Row justifyContent={'left'} pt={5}>
          <Text color= "trueGray.900" fontSize="sm" fontWeight="bold">Select Age Range:</Text>
          <Spacer/>
          <Text>{ageRange[0]} - {ageRange[1]}</Text>
        </Row>
        <Row justifyContent={"center"} >
          <MultiSlider
            values={ageRange}
            onValuesChange={(values) => setAgeRange(values)}
            min={18}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            selectedStyle= {{backgroundColor: "#075985"}}
          />
        </Row>
        <Row justifyContent={'left'}>
          <Text color= "trueGray.900" fontSize="sm" fontWeight="bold">Select Gym Experience Range:</Text>
          <Spacer/>
          <Text>{experienceRange[0]} - {experienceRange[1]}</Text>
        </Row>
        <Row justifyContent={"center"}>
          <MultiSlider
            values={experienceRange}
            onValuesChange={(values) => setExperienceRange(values)}
            min={0}
            max={20}
            step={1}
            allowOverlap={false}
            snapped
            selectedStyle= {{backgroundColor: "#075985"}}
          />
        </Row>
      
      */}