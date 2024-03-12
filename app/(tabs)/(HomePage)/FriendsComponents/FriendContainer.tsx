import React, {useState} from 'react'
import { Flex, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions';

interface FriendProps {
    friend: IUser;
}

const friendContainer: React.FC<FriendProps> = ({ friend }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    // TODO: Display user preview when clicked
    const handleUserClick  = async () =>{
        setIsPressed(true)
        console.log("Friend pressed")
        // Do something when user is clicked
        // Open Profile
    };
    return (
        <Pressable 
            onPress = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            p = {3} mb ={3} ml={1} mr={1} // This okay?
            borderRadius="xl" borderWidth={1} borderColor="trueGray.50" shadow="3"
            bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
            >
        <Flex            >
            <Row alignItems="center" space="sm">
                {/* Replace 'friend.icon' with the actual profile picture source */}
                <Avatar size= "xl" source={require("../bob.png")} />
                <Column>    
                    <Text color= "trueGray.900" fontSize="md" fontWeight="bold">{friend.name}</Text>
                    <Text/>
                </Column>
            </Row>
        </Flex>
        </Pressable>
    );
  };

  export default friendContainer;