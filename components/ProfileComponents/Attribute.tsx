import Tags from "./Tags";
import { Flex,Pressable, Badge, Input, Button } from "native-base";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface props{
    description:string[];
    onSaveTag: (addTag: string) => void;

}

export default function Attribute({description, onSaveTag}:props) {

  const [editMode, setEditMode] = useState(false);
  const [addTag, setAddTag] = useState("");

  const handleSave = () => {
    if (addTag === "") {
      onSaveTag(addTag as string);
    }
    setEditMode(false);
  }
  const handleCancel = () => {
    setEditMode(false);
  }
  return (
    <>
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={2} mb={2}>
        {description.map((tag) => (
          <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {tag}
          </Badge>
        ))}

        {!editMode && (
          <Pressable onPress={() => setEditMode(true)}>
            <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {"+"}
          </Badge>
          </Pressable>
        )}
      </Flex>
        {editMode && (
          <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3} mb={4}>
          <Input
            multiline={false}
            color={"lightBlue.900"}
            padding={3}
            value={addTag}
            onChangeText={setAddTag}
            placeholder="new tag"
            width="60%"
          />
          <Button
            alignSelf="flex-start"
            ml={2}
            onPress={handleSave}
            backgroundColor={"#F97316"}
            leftIcon={<AntDesign name="check" size={24} color="white" />}
            _pressed={{ opacity: 0.5 }}
          >
          </Button>
          <Button
            alignSelf="flex-start"
            ml={2}
            onPress={handleCancel}
            backgroundColor={"#F97316"}
            leftIcon={<AntDesign name="close" size={24} color="white" />} 
            _pressed={{ opacity: 0.5 }}
          >
          </Button>
         </Flex>
         )}
    </>
  );
}