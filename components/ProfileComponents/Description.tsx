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

export default function Description() {
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
          Hi! I am a recent college entrant who happens to be a little
          introverted. Upon arriving at college, I notice impressive physiques
          and I want to training but I don’t not know how to. So I am looking
          for solutions and I am willing to even pay for one.
        </Text>
      </Box>
    </VStack>
  );
}
