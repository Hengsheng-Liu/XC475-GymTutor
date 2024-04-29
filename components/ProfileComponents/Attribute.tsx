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
  const MAX_TAG_LENGTH = 10;

  // const [deleteTag, setDeleteTag] = useState("");

  const handleSave = () => {
    if (addTag.length > MAX_TAG_LENGTH) {
      // Alert the user that the tag exceeds the character limit
      // You can display a toast message, show an alert, or handle it in any way you prefer
      alert(`Tag must be ${MAX_TAG_LENGTH} characters or fewer`);
      return;
    }
    if (addTag.length === 0 || (addTag.trim() !== "")) {
      // Alert the user that the tag exceeds the character limit
      // You can display a toast message, show an alert, or handle it in any way you prefer
      alert(`Tag must be not be empty`);
      return;
    }
    onSaveTag(addTag as string);
    setAddTag("");
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
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={2} mb={2}>
        {description.map((tag) => (
          <Pressable key={tag}
          onLongPress={() => handleTagDelete(tag)} _pressed={{ opacity: 0.5 }}
          >
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

        {editMode && (
          <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3} mb={4}>
          <Input
            multiline={false}
            color={"lightBlue.900"}
            padding={3}
            value={addTag}
            onChangeText={setAddTag}
            placeholder="Add a new tag"
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
        </Flex>)}
        {deleteMode && (
          <Button
            alignSelf="flex-start"
            mt={2}
            ml={2}
            onPress={handleDeleteCancel}
            
            backgroundColor={"#F97316"}
            leftIcon={<AntDesign name="close" size={24} color="white" />} 
            _pressed={{ opacity: 0.5 }}>
            Cancel
          </Button>
        )}
      </Flex>
    </>
  );
}