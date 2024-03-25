import Tags from "./Tags";
import { Flex, Box, Pressable } from "native-base";

interface props{
    description:string[];
}
export default function Attribute({description}:props) {
  return (
    <Box overflow="hidden">
      <Flex flexDirection="row" justifyContent="space-evenly" mt={3}>
        {description.slice(0, 3).map((str, index) => (
          <Tags key={index} title={str} />
        ))}
      </Flex>
    </Box>
  );
}
