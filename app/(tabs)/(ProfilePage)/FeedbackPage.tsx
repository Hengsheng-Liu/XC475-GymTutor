import {
  NativeBaseProvider,
  Input,
  Box,
  Row,
  Spacer,
  Heading,
  Select,
  Checkbox,
  VStack,
  Button,
  Text,
  Toast
} from "native-base";
import { useAuth } from "@/Context/AuthContext";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { addFeedback } from "@/components/FeedbackFunctions";


const FeedbackPage = () => {
  const { User, currUser } = useAuth();
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("");  // State for feedback type
  const [isAnonymous, setIsAnonymous] = useState(false); // State for anonymous checkbox

  const checkWords = (text: string) => {
    const charCount = text.trim().length; // Trim to remove leading/trailing whitespace and count characters
    if (charCount <= 400) {
      return true;
    } else {
      // Provide feedback to the user when the character limit is exceeded
      alert("Please make sure your feedback is under 400 characters.");
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const currentDate = new Date();

      let userId = "";
      let userName: string | undefined = "Anonymous";

      if (!isAnonymous) {
        userId = User?.uid ? User?.uid : "";
        userName = currUser?.name;
      }

      if (feedbackText == "") {
        Alert.alert("Please enter your feedback");
        return;
      }
      if (feedbackType == "") {
        Alert.alert("Please select your feedback type");
        return;
      }

      if (checkWords(feedbackText) &&
        feedbackText &&
        feedbackType &&
        userName) {
        await addFeedback(
          userId,
          userName,
          feedbackType,
          feedbackText
        )

        // Show success toast notification
        Toast.show({
          title: "Feedback Submitted",
          description: "Your feedback has been submitted successfully!",
          duration: 3000,  // Duration in milliseconds (3 seconds)
        });

        // Navigate back after the toast
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } catch (error) {
      console.error("Submission failed", error);
      Alert.alert("Error", "Failed to complete the feedback submit process.");
    }

  }

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <Box p={15} pb={3} alignItems="center" justifyContent="space-between">
          <Row alignItems={"center"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer />
            <Box>
              <Heading fontSize="lg" color="trueGray.800">Feedback</Heading>
            </Box>
            <Spacer />
            <TouchableOpacity activeOpacity={0.7}>
              <FontAwesome name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Row>
        </Box>

        <VStack space={4} ml={3} mr={3}>

          {/* Dropdown menu for selecting feedback type */}
          <Select
            selectedValue={feedbackType}
            minWidth="200"
            accessibilityLabel="Choose Feedback Type"
            placeholder="Choose Feedback Type"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <FontAwesome name="check" size={20} />,
            }}
            mt={1}
            onValueChange={(itemValue) => setFeedbackType(itemValue)}
          >
            <Select.Item label="Bug Report" value="bug" />
            <Select.Item label="Feature Request" value="feature" />
            <Select.Item label="General Feedback" value="general" />
          </Select>

          {/* Text input for feedback */}
          <Input
            multiline={true}
            color={"trueGray.900"}
            padding={3}
            borderRadius={10}
            borderWidth="2"
            height={110}
            maxHeight={110}
            fontSize="sm"
            letterSpacing={0.3}
            _focus={{ borderColor: "#F97316", backgroundColor: "gray.100" }}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Enter your feedback (under 400 characters)"
          />
          {/* Checkbox for anonymous feedback */}
          <Checkbox
            value="anonymous"
            isChecked={isAnonymous}
            onChange={setIsAnonymous}
            accessibilityLabel="Submit feedback anonymously"
          >
            Submit feedback anonymously
          </Checkbox>
          <Button
            flexGrow={"1"}
            backgroundColor={"#F97316"}
            shadow="2"
            borderRadius={16}
            justifyContent={"center"}
            _pressed={{ opacity: 0.5 }}
            leftIcon={<AntDesign name="check" size={24} color="white" />}
            onPress={() => handleSubmit()}
          >
            <Text fontSize="md" color="#FFFFFF" >Submit</Text>
          </Button>
        </VStack>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default FeedbackPage;
