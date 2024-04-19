import { Button, HStack } from "native-base";
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
      mt={6}
      textAlign={"center"}
    >
      <Button flexGrow={"1"} variant={"outline"} onPress={() => router.push("/Friends")}>
        {friendCount} 
      </Button>

      <Button
        flexGrow={"1"}
        backgroundColor={"#0284C7"}
        leftIcon={<AntDesign name="check" size={24} color="white" />}
        onPress={() => handleCheckIn(gym,History)}
      >
        Check In
      </Button>
    </HStack>
  );
}
