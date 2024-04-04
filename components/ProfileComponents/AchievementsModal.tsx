import {
  VStack,
  Spacer,
  Flex,
  Box,
  Center,
  Heading,
  Text,
  Modal,
  Button,
} from "native-base";
import { useState } from "react";
import { Pressable } from "react-native";
import { SvgUri } from "react-native-svg";
interface AchievementProps {
  image: React.JSX.Element;
  name: string;
  description: string;
  achieved?: boolean;
  current:number;
  max:number;
}

const AchievementModal = ({ image, name, description, current, max,achieved}: AchievementProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Flex
      width={"1/3"}
      height={40}
      
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box borderWidth={5} borderColor={"#EA580C"} borderRadius={"5"}>
        <Pressable onPress={() => setShowModal(true)}>{image}</Pressable>
      </Box>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"md"}>
        <Modal.Content>
          <Modal.CloseButton />
          <Center>
          <Modal.Header>{name}</Modal.Header>
          </Center>
          <Modal.Body>
            <Flex alignItems={"center"}>
              <Box marginBottom={5}>
                <Center>{image}</Center>
              </Box>
              <Text marginBottom={"5"}>{description}</Text>
              {!achieved && <Button bgColor="#EA580C"><Text color = "#FAFAFA">You Status: {current}/{max}</Text></Button>}
            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Flex>
  );
};

export default AchievementModal;
