import Tags from "./Tags";
import { Flex,Pressable } from "native-base";

interface props{
    description:string[];
}
export default function Attribute({description}:props) {
  return (
    <Flex
      flexDirection="row"
      wrap="wrap"
      justifyContent={"space-evenly"}
      mt={3}
    >
      {description.map((str, index) => (
        <Tags key={index} title={str} />
      ))}
      <Pressable onPress={() => console.log("add")}>
        <Tags title={"+"} />
      </Pressable>
    </Flex>
  );
}
