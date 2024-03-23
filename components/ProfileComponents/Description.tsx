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
        <Heading mr={"3"}>Description</Heading>
        {!editMode && (
          <Pressable onPress={() => setEditMode(true)}>
            <FontAwesome6 name="pencil" size={22} color="black" />
          </Pressable>
        )}
      </HStack>
      <Box 
      flexDirection="column"
      alignItems="flex-start"
      shadow={3} 
      backgroundColor={"gray.100"} 
      mt={2} 
      borderRadius={10}>
        
        {editMode ? (
          <Input
            multiline={true}
            color={"lightBlue.900"} mt={2} padding={3}
            value={newBio}
            onChangeText={setNewBio}
            placeholder="Enter your description"
          />
        ) : (
          <Text color={"lightBlue.900"} mt={2} padding={3}>
            {bio}
          </Text>
        )}
      </Box>
      {editMode && (

              <Button
              onPress={handleSave}
              flexGrow={"1"}
              backgroundColor={"#0284C7"}
              leftIcon={<AntDesign name="check" size={24} color="white" />}
            >
              Save
            </Button>
      )}
    </VStack>
  );
}