import {
  NativeBaseProvider,
  Button,
  Box,
  Heading,
  VStack,
  Row,
  Text,
  Toast,
  ScrollView,
} from "native-base";
import React, { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { useAuth } from "@/Context/AuthContext";

const StreakPage = () => {
  const { User, currUser } = useAuth();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const daysOfWeek = [
    { label: "Mon", value: "Monday" },
    { label: "Tue", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thu", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
    { label: "Sun", value: "Sunday" },
  ];

  useEffect(() => {
    const fetchStreaks = async () => {
      if (User) {
        try {
          const userDocRef = doc(firestore, "Users", User.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.streaks && userData.streaks.selectedDays) {
              setSelectedDays(userData.streaks.selectedDays); // Set the existing selected days
            }
          }
        } catch (error) {
          console.error("Error fetching streaks: ", error);
        } finally {
          setLoading(false); // Set loading to false once the data is fetched
        }
      }
    };

    fetchStreaks();
  }, [User]);

  const updateStreaks = async (selectedDays: string[]) => {
    if (User) {
      try {
        const userDocRef = doc(firestore, "Users", User.uid);

        await updateDoc(userDocRef, {
          streaks: {
            selectedDays: selectedDays,
            lastUpdatedAt: serverTimestamp(),
          },
        });

        console.log("Streaks updated successfully!");
      } catch (error) {
        console.error("Error updating streaks: ", error);
      }

      router.back();
    }
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day) // Unselect if already selected
        : [...prevDays, day] // Select if not already selected
    );
  };

  const handleSave = async () => {
    try {
      if (selectedDays.length === 0) {
        Toast.show({
          title: "No Days Selected",
          description: "Please select at least one day to work out!",
          duration: 3000,
        });
        return;
      }

      await updateStreaks(selectedDays);

      Toast.show({
        title: "Workout Days Saved",
        description: "Your workout streak has been saved successfully!",
        duration: 3000,
      });

      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (error) {
      console.error("Failed to save streaks", error);
      Alert.alert("Error", "Failed to complete the saving process.");
    }
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
        <Box p={15} pb={3} alignItems="center" justifyContent="space-between">
          <Row alignItems={"center"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Box flex={1} alignItems="center">
              <Heading fontSize="lg" color="trueGray.800">
                Select Workout Days
              </Heading>
            </Box>
            <TouchableOpacity activeOpacity={0.7}>
              <FontAwesome name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Row>
        </Box>

        {loading ? (
          <Text alignSelf="center" mt={5}>
            Loading your streaks...
          </Text>
        ) : (
          <VStack space={4} ml={3} mr={3}>
            <Heading fontSize="md" color="trueGray.700" alignSelf="center">
              Choose your workout days
            </Heading>

            {/* Buttons for each day of the week */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Row justifyContent="space-between" space={3}>
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.value}
                    flexGrow={"1"}
                    borderRadius={"50%"} // Make buttons circular
                    width={60}
                    height={60}
                    justifyContent={"center"}
                    alignItems={"center"}
                    backgroundColor={
                      selectedDays.includes(day.value) ? "#F97316" : "#E0E0E0"
                    }
                    _pressed={{ opacity: 0.5 }}
                    onPress={() => toggleDaySelection(day.value)}
                  >
                    <Text
                      fontSize="md"
                      color={
                        selectedDays.includes(day.value) ? "#FFFFFF" : "#000"
                      }
                    >
                      {day.label}
                    </Text>
                  </Button>
                ))}
              </Row>
            </ScrollView>
          </VStack>
        )}

        {/* Save Button at the bottom */}
        <Box p={5}>
          <Button
            flexGrow={"1"}
            backgroundColor={"#F97316"}
            shadow="2"
            borderRadius={16}
            justifyContent={"center"}
            _pressed={{ opacity: 0.5 }}
            leftIcon={<AntDesign name="save" size={24} color="white" />}
            onPress={handleSave}
          >
            <Text fontSize="md" color="#FFFFFF">
              Save
            </Text>
          </Button>
        </Box>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default StreakPage;
