import { HStack, Heading, Pressable, Text, VStack, Box, Input, Button } from "native-base";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface DescriptionProps{
  bio: string;
}

export default function Description({bio}: DescriptionProps) {
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState(bio);
  
  return (
    <VStack mt={"4"}>
      <HStack>
        <Heading mr={"3"} color="trueGray.900">Description</Heading>
      </HStack>
      <Box 
        flexDirection="column"
        alignItems="flex-start"
        shadow={3} 
        backgroundColor={"gray.100"} 
        mt={2} 
        borderRadius={10}>
          <Text color={"trueGray.900"} mt={2} padding={3}>
            {bio}
          </Text>
      </Box>
    </VStack>
  );
}