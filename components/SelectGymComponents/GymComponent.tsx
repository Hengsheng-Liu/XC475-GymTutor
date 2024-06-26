import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Avatar, Box, Flex, Heading, Row, Text } from "native-base";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import ChooseGym from "./ChooseGymDialog";
import { Geometry } from "react-native-google-places-autocomplete";
interface GymIcon {
  photoURL: string;
  height: number;
  width: number;
}
interface props {
  title: string;
  Address: string;
  photo?: GymIcon;
  Geometry: Geometry;
  place_id: string;
}

function GetPhotoURL(photo: GymIcon | undefined) {
  if (!photo) {
    return (
      <FontAwesome
        name="question-circle"
        size={55}
        color="#171717"
        style={{ marginRight: 4 }}
      />
    );
  } else {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photo.width}&photoreference=${photo.photoURL}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
    return <Avatar source={{ uri: url }} mr={2} />;
  }
}
export default function Gym({ title, Address, photo,Geometry,place_id }: props) {
  const [OpenGymDialog, setOpenGymDialog] = React.useState(false);
  return (
    <Box>
      <Pressable
        onPress={() => setOpenGymDialog(true)}
      >
        <Box
          mt={1}
          borderBottomColor={"#075985"}
          borderBottomWidth={"1"}
          p={5}
          mb={1}
        >
          <Flex
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Flex flexDirection={"row"}>
              {GetPhotoURL(photo)}
              <Flex flex={1}>
                <Heading size="md"> {title}</Heading>
                <Text fontSize="sm" ml={1}>{Address}</Text>
              </Flex>
            </Flex>
            <FontAwesome5
              name="chevron-right"
              size={25}
              color="#171717"
            />

          </Flex>
        </Box>
      </Pressable>
      <ChooseGym
        title={title}
        Geometry={Geometry}
        place_id={place_id}
        handleOpenGymDialog={setOpenGymDialog}
        OpenGymDialog={OpenGymDialog}
        closeGymDialog={() => setOpenGymDialog(false)}
        Address={Address}
        />
    </Box>
  );
}
