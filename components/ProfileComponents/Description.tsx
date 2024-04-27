import {
  Flex,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack,
  Box,
  Input,
  Button
} from "native-base";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface DescriptionProps{
  bio: string;
  onSave: (newBio: string) => void;
}

export default function Description({bio, onSave}: DescriptionProps) {
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState(bio);

  const handleSave = () => {
    onSave(newBio as string);
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
      backgroundColor={"gray.100"} 
      mt={2} 
      borderRadius={10}>
        
        {editMode ? (
          <Input
            multiline={true}
            color={"trueGray.900"} padding={3}
            borderWidth="0"
            value={newBio}
            onChangeText={setNewBio}
            placeholder="Enter your description"
          />
        ) : (
          <Text color={"trueGray.900"} padding={3}>
            {bio}
          </Text>
        )}
      </Box>
      {editMode && (

              <Button
              alignSelf="left"
              mt={2}
              width="auto"
              justifyContent="center"
              alignItems="center"
              px={6}
              onPress={handleSave}
              backgroundColor={"#F97316"}
              _pressed={{ opacity: 0.5 }}
              leftIcon={<AntDesign name="check" size={24} color="white" />}
            >
              Save
            </Button>
      )}
    </VStack>
  );
}