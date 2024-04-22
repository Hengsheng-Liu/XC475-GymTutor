import Tags from "./Tags";
import { Flex,Pressable, Badge, Input, Button } from "native-base";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface props{
    description:string[];
    onSaveTag: (addTag: string) => void;
    onDeleteTag:(deleteTag: string) => void;

}

export default function Attribute({description, onSaveTag, onDeleteTag}:props) {

  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [addTag, setAddTag] = useState("");
 // const [deleteTag, setDeleteTag] = useState("");

  const handleSave = () => {
    if (addTag === "") {
      onSaveTag(addTag as string);
    }
    setEditMode(false);
  }
  const handleCancel = () => {
    setEditMode(false);
  }

  const handleTagDelete = (tag: string) => {

    console.log("the tag pressed to delete is " + tag);

    onDeleteTag(tag as string); 
    setDeleteMode(false);


  }
  const handleDeleteCancel = () => {
    setDeleteMode(false);
  }


  return (
    <>
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
        {description.map((tag) => (
          <Pressable key={tag} onPress={() => deleteMode && handleTagDelete(tag)}>
          <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {tag}
          </Badge>
          </Pressable>
        ))}

        {!editMode && !deleteMode && (
          <Pressable onPress={() => setEditMode(true)}>
            <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {"+"}
          </Badge>
          </Pressable>
        )}
         {!editMode && !deleteMode && (
          <Pressable onPress={() => setDeleteMode(true)}>
            <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {"-"}
          </Badge>
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

      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
      {editMode && (
        <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleSave}
          backgroundColor={"#F97316"}
          leftIcon={<AntDesign name="check" size={24} color="white" />}
          _pressed={{ opacity: 0.5 }}
        >
          Add
        </Button>

      )}
      {editMode && (
          <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleCancel}
          
          backgroundColor={"#F97316"}
          leftIcon={<AntDesign name="close" size={24} color="white" 
          _pressed={{ opacity: 0.5 }}
          />
        }
        >
          Cancel
        </Button>
      )}
        {deleteMode && (
          <Button
          alignSelf="flex-start"
          mt={2}
          ml={2}
          onPress={handleDeleteCancel}
          
          backgroundColor={"#F97316"}
          leftIcon={<AntDesign name="close" size={24} color="white" 
          _pressed={{ opacity: 0.5 }}
          />
        }
        >
          Cancel
        </Button>
      )}
         </Flex>
    </>
  );
}