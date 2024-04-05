import Tags from "./Tags";
import { Flex, Box, Pressable } from "native-base";

interface props{
    description:string[];
}
export default function Attribute({description}:props) {
  return (
    <Box overflow="hidden" justifyContent={"left"}>
      <Flex flexDirection="row">
        {description.slice(0, 2).map((str, index) => (
          <Tags key={index} title={str} />
        ))}
      </Flex>
    </Box>
  );
}
