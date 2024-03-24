import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator} from 'react-native';
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flex, Text, View, Button, Select, Input, Checkbox} from "native-base";
import { firestore } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

import FriendContainer from "@/components/FriendsComponents/FriendContainer";
import fetchUsers from "@/components/FriendsComponents/FetchUsers";
import theme from '@/components/theme';
import { getCurrUser } from '@/components/FirebaseUserFunctions';

export default function FilterScreen () {
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [gymActivity, setGymActivity] = useState('');
    const [otherValue, setOtherValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);
  
    const handleApplyFilters = () => {
      // Handle applying filters
      console.log('Sex:', sex);
      console.log('Age:', age);
      console.log('Gym Activity:', gymActivity);
      console.log('Other Value:', otherValue);
      console.log('Is Checked:', isChecked);
    };

  return (
    <NativeBaseProvider theme = {theme} >
      <SafeAreaView style= {{backgroundColor: "#FFF", flex:1, padding: 15}}>
      <ScrollView>
      <View style={{ padding: 10 }}>
        <Text>Select Sex:</Text>
        <Select
          selectedValue={sex}
          onValueChange={(value) => setSex(value)}
          placeholder="Select Sex"
        >
          <Select.Item label="Male" value="male" />
          <Select.Item label="Female" value="female" />
          <Select.Item label="Other" value="other" />
        </Select>
      </View>
      <View style={{ padding: 10 }}>
        <Text>Enter Age:</Text>
        <Input
          value={age}
          onChangeText={(value) => setAge(value)}
          keyboardType="numeric"
          placeholder="Enter Age"
        />
      </View>
      <View style={{ padding: 10 }}>
        <Text>Select Gym Activity:</Text>
        <Select
          selectedValue={gymActivity}
          onValueChange={(value) => setGymActivity(value)}
          placeholder="Select Gym Activity"
        >
          <Select.Item label="Cardio" value="cardio" />
          <Select.Item label="Weightlifting" value="weightlifting" />
          <Select.Item label="Yoga" value="yoga" />
          {/* Add more options as needed */}
        </Select>
      </View>
      <View style={{ padding: 10 }}>
        <Text>Enter Other Value:</Text>
        <Input
          value={otherValue}
          onChangeText={(value) => setOtherValue(value)}
          placeholder="Enter Other Value"
        />
      </View>
      <View style={{ padding: 10 }}>
        <Checkbox value="one" onChange={setIsChecked}>
            Check to Enable Filters
        </Checkbox>
      </View>
      <Button onPress={handleApplyFilters} style={{ margin: 10 }}>
        Apply Filters
      </Button>
    </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};