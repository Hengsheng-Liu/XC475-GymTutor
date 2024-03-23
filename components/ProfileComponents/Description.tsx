import {
  Flex,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack,
  Box,
} from "native-base";
import { FontAwesome6 } from "@expo/vector-icons";

interface DescriptionProps{
  bio: string;
}

export default function Description({bio}: DescriptionProps) {
  console.log("bio is", bio);
  return (
    <VStack mt={"4"}>
      <HStack>
        <Heading mr={"3"}>Description</Heading>
        <Pressable onPress={() => console.log("Description pressed!")}>
          <FontAwesome6 name="pencil" size={22} color="black" />
        </Pressable>
      </HStack>
      <Box  shadow={3} backgroundColor={"gray.100"} mt ={2} borderRadius={10}>
        <Text
          color={"lightBlue.900"}
          mt={2}
          padding={3}
        >
          {bio}

        </Text>
      </Box>
    </VStack>
  );
}
