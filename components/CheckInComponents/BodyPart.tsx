import { Tag, Box, Pressable,Flex, Badge } from "native-base";

interface BodyPartProps {
    selectedBodyParts: string[] ;
    setSelectedBodyParts: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function BodyPart(
    {selectedBodyParts, setSelectedBodyParts}: BodyPartProps

) {
  const BodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core","Full Body", "Cardio",];
  const handleSelect = (part: string) => {
    if (selectedBodyParts.includes(part)) {
        setSelectedBodyParts(selectedBodyParts.filter((item) => item !== part));
    } else {
        setSelectedBodyParts([...selectedBodyParts, part]);
    }
    
    
  }
  return (
    <Flex flexDir={"row"} flexWrap={"wrap"}  marginX={10} paddingTop={35}>
      {BodyParts.map((part) => (
        <Pressable key = {part} onPress={() => handleSelect(part)}>
          <Badge
            key={part}
            variant="solid"
            background={selectedBodyParts.includes(part) ? "#7C2D12" : "#FDBA74"}
            _text={{
                fontSize: 14,
                color: selectedBodyParts.includes(part) ? "#FAFAFA" : "#211912"
            }}
            margin={2}
            borderRadius={5}
          >
            {part}
          </Badge>
        </Pressable>
      ))}
    </Flex>
  );
}
