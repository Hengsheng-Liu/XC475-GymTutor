import { Tag, Box, Pressable,Flex, Badge } from "native-base";
import React, { useState } from "react";
export default function BodyPart() {
  const BodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio",];
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (part: string) => {
    if (selected.includes(part)) {
      setSelected(selected.filter((item) => item !== part));
    } else {
      setSelected([...selected, part]);
    }
  }
  return (
    <Flex flexDir={"row"} flexWrap={"wrap"}  marginX={10} paddingTop={35}>
      {BodyParts.map((part) => (
        <Pressable onPress={() => handleSelect(part)}>
          <Badge
            key={part}
            variant="solid"
            background={selected.includes(part) ? "#7C2D12" : "#FDBA74"}
            _text={{
                fontSize: 14,
                color: selected.includes(part) ? "#FAFAFA" : "#211912"
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
