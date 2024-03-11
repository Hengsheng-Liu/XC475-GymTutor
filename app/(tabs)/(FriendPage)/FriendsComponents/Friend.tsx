import React, {useState} from 'react'
import { Flex, Row, Column, Pressable, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseDataService';

interface FriendProps {
    friend: IUser;
}

const Friend: React.FC<FriendProps> = ({ friend }) => {
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
            onPressIn = {() => handleUserClick()}
            onPressOut={() => setIsPressed(false)}
            p = {3} // This okay?
            borderBottomColor="trueGray.200" shadow="3"
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

  export default Friend;