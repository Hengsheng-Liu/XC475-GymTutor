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
  Pressable
} from "native-base";
import { useEffect, useState } from "react";

import { SvgUri } from "react-native-svg";
interface AchievementProps {
  image: React.JSX.Element;
  name: string;
  description: string;
  achieved?: boolean;
  current:number;
  max:number;
  edit?: boolean
  display?: string[];
  setdisplay?: React.Dispatch<React.SetStateAction<string[]>>
}

const AchievementModal = ({ image, name, description, current, max,achieved,edit,display,setdisplay}: AchievementProps) => {
  const [showModal, setShowModal] = useState(false);
  const handlePress = () => {
    if (edit){
      if (display?.includes(name)){
        setdisplay?.(display.filter((item) => item !== name));
      } else {
        if (display?.length === 3){
          display?.shift();
          
        }
        setdisplay?.([...(display ?? []), name]);
      }
    }else{
      setShowModal(true);
    }
  }
  const setBorderColor = () => {
    if (edit && display?.includes(name)){
      return "#7DD3FC";
    }else if(!achieved){
      return "#525252";
    }
    else{
      return "#EA580C";
    }
  }
  return (
    <Flex
    width={"32"}
    height={"32"}
    >

      <Pressable borderRadius={"5"} borderWidth={5} borderColor={setBorderColor()} margin={"1.5"} onPress={handlePress}>{image}

      </Pressable>
      

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"md"}>
        <Modal.Content>
          <Modal.CloseButton />
          <Center>
          <Modal.Header >{name}</Modal.Header>
          </Center>
          <Modal.Body>
            <Flex alignItems={"center"}>
              <Box marginBottom={5}>
                <Center>
                  <Box height={40} width={40}>
                  {image}
                  </Box>
                  </Center>
              </Box>
              <Text marginBottom={"5"}>{description}</Text>
              {!achieved && <Button bgColor="#EA580C"><Text color = "#FAFAFA">Your Status: {current}/{max}</Text></Button>}
            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Flex>
  );
};

export default AchievementModal;
