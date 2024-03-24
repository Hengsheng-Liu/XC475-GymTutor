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


const FilterScreen = () => {
    const [sex, setSex] = useState<string>("");
    const [ageRange, setAgeRange] = useState([18, 65]); // Default age range
    const [experienceRange, setExperienceRange] = useState([0, 10]); // Default XP range    
    const [gymExperience, setGymExperience] = useState('');
    // const [otherValue, setOtherValue] = useState('');
    // const [isChecked, setIsChecked] = useState(false);

    const { User } = useAuth();
    const db = firestore;
  
    const handleApplyFilters = () => {
      // Handle applying filters
      // Construct the filters object
    const filters =  [
      { field: "sex", operator: "==", value: sex }, 
      { field: "age", operator: ">=", value: ageRange[0] },
      { field: "age", operator: "<=", value: ageRange[1] },
      { field: "gymExperience", operator: ">=", value: experienceRange[0] },
      { field: "gymExperience", operator: "<=", value: experienceRange[1] }
    ];

    const updateUserFilter = async () => {
      if (!User) return;
      const userDocRef = doc(db, "Users", User.uid);
      await updateDoc(userDocRef, {
        filters: filters
      });
      console.log("Updated filters of User");
      console.log("Filters added", filters);
    };
    
    updateUserFilter();
    };

  return (
    <NativeBaseProvider theme={theme}>
      <View style={{ backgroundColor: "#FFF", flex: 1, padding: 15, paddingTop: 2 }}>
        <Text pt={2} pb={2} color= "trueGray.900" fontSize="sm" fontWeight="bold">Select Sex:</Text>
        <Radio.Group 
          defaultValue="both" 
          name="sex"
          onChange={values => {setSex(values)}}>
          <Radio value="male" my={1}> Male </Radio>
          <Radio value="female" my={1}> Female </Radio>
          <Radio value="both" my={1}> Both </Radio>
          <Radio value="other" my={1}> Other </Radio>
        </Radio.Group>
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
        <Button onPress={handleApplyFilters} style={{ marginTop: 10  }}>
          Apply Filters
        </Button>
      </View>
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
        </View> */}