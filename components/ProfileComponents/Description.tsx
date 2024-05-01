import {
  Flex,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack,
  Box,
  Input,
  Button,
} from "native-base";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface DescriptionProps {
  bio: string;
  onSave: (newBio: string) => void;
}

export default function Description({ bio, onSave }: DescriptionProps) {
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState(bio);

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

  const handleSave = () => {
    if (checkWords(newBio)) {
      onSave(newBio.trim() as string);
      setEditMode(false);
    }
  };

  const handleCancel = () =>{
    setNewBio(bio);
    setEditMode(false);
  }

  return (
    <VStack mt={"4"}>
      <HStack>
        <Heading mr={"3"} mb={1}>Description</Heading>
        {!editMode && (
          <Pressable justifyContent="center" justifyItems="center" onPress={() => setEditMode(true)}>
            <FontAwesome6 name="pencil" size={20} color="black" />
          </Pressable>
        )}
      </HStack>
      <Box 
      flexDirection="column"
      alignItems="flex-start"
      shadow={1}
      height={110}
      maxHeight={110}
      backgroundColor={"gray.100"} 
      mt={2} 
      borderRadius={10}>
        
        {editMode ? (
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
            _focus={{borderColor: "#F97316", backgroundColor: "gray.100"}}
            value={newBio}
            onChangeText={setNewBio}
            placeholder="Enter your description"
          />
        ) : (
          <Text fontSize="sm" color={"trueGray.900"} padding={3}>
            {bio}
          </Text>
        )}
      </Box>
      {editMode && (
        <Flex flexDir={"row"} justifyContent={'center'} >
        <Button
          alignSelf="left"
          mt={2}
          width="auto"
          justifyContent="center"
          alignItems="center"
          px={6}
          mr={'4'}
          onPress={handleSave}
          backgroundColor={"#F97316"}
          _pressed={{ opacity: 0.5 }}
          leftIcon={<AntDesign name="check" size={24} color="white" />}
        >
          Save
        </Button>
        <Button
          alignSelf="left"
          mt={2}
          width="auto"
          justifyContent="center"
          alignItems="center"
          px={6}
          onPress={handleCancel}
          backgroundColor={"#F97316"}
          _pressed={{ opacity: 0.5 }}
          leftIcon={<AntDesign name="close" size={24} color="white" />}
        >
          Cancel
        </Button>
        </Flex>
      )}
    </VStack>
  );
}
