import { Button, Text, HStack } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { handleCheckIn}  from "../GeolocationFunction";
interface ButtonGroupProps{
  friendCount: String;
  gym: [string,string] | undefined;
  History: string[];
}


export default function ButtonGroup({friendCount,gym,History}:ButtonGroupProps) {
  return (
    <HStack
      space={3}
      justifyContent={"space-around"}
      mt={1}
      textAlign={"center"}
    >
      <Button flexGrow={"1"} variant={"outline"} width="30%"
        borderRadius={16} borderColor="#F97316" borderWidth="2" onPress={() => router.push("/Friends")}>
        <Text fontSize="md" color="#C2410C" >{friendCount}</Text> 
      </Button>

      <Button
        flexGrow={"1"}
        backgroundColor={"#F97316"}
        shadow="2"
        borderRadius={16}
        justifyContent={"center"}
        _pressed={{ opacity: 0.5 }}
        leftIcon={<AntDesign name="check" size={24} color="white" />}
        onPress={() => handleCheckIn(gym,History)}
      >
        <Text fontSize="md" color="#FFFFFF" >Check In</Text> 
      </Button>
    </HStack>
  );
}
