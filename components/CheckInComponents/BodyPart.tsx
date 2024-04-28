import { Tag, Box, Pressable, Flex, Badge } from "native-base";

interface BodyPartProps {
  selectedBodyParts: string[];
  setSelectedBodyParts: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function BodyPart({
  selectedBodyParts,
  setSelectedBodyParts,
}: BodyPartProps) {
  const BodyParts = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
    "FullBody",
    "Cardio",
  ];
  const handleSelect = (part: string) => {
    let newSelectedBodyParts = [...selectedBodyParts];
  
    if (part === "FullBody") {
      setSelectedBodyParts(["FullBody"]);
      return;
    }
  
    if (newSelectedBodyParts.includes("FullBody")) {
      newSelectedBodyParts = [part];
    } else if (newSelectedBodyParts.includes(part)) {
      newSelectedBodyParts = newSelectedBodyParts.filter((item) => item !== part);
    } else {
      newSelectedBodyParts.push(part);
    }
  
    if (newSelectedBodyParts.length > 2) {
      newSelectedBodyParts.shift();
    }
  
    setSelectedBodyParts(newSelectedBodyParts);
  };
  

  return (
    <Flex flexDir={"row"} justifyContent="center" flexWrap={"wrap"} alignItems="center" marginX={10} paddingTop={0} pb={5}>
      {BodyParts.map((part) => (
        <Pressable  key={part} onPress={() => handleSelect(part)}>
          <Badge
            key={part}
            variant="solid"
            background={
              selectedBodyParts.includes(part) ? "#7C2D12" : "#FDBA74"
            }
            _text={{
              fontSize: 14,
              color: selectedBodyParts.includes(part) ? "#FAFAFA" : "#211912",
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
