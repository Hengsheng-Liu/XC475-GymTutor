import Tags from "./Tags";
import { Flex,Pressable, Input, Button } from "native-base";
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
    onSaveTag(addTag as string);
    setEditMode(false);

  }
  return (
    <>
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
        {description.map((str, index) => (
          <Tags key={index} title={str} />
        ))}

        {!editMode && (
          <Pressable onPress={() => setEditMode(true)}>
            <Tags title={"+"} />
          </Pressable>
        )}

        {editMode && (
          <Input
            multiline={false}
            color={"lightBlue.900"}
            mt={2}
            padding={3}
            value={addTag}
            onChangeText={setAddTag}
            placeholder="new tag"
            width="50%"
          />
        )}
      </Flex>

      {editMode && (
        <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleSave}
          backgroundColor={"#0284C7"}
          leftIcon={<AntDesign name="check" size={24} color="white" />}
        >
          Save
        </Button>
      )}
    </>
  );
}