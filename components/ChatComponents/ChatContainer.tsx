import React from 'react'
import { Flex, Spacer, Row, Column, Text, Avatar} from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions'; 
import { useAuth } from "@/Context/AuthContext";

interface FriendProps {
    friend: IUser;
}

const ChatPreview: React.FC<FriendProps> = ({ friend }) => {
    const {currUser} = useAuth();
    if (!currUser) return;

    // TODO: Get the last message from the user and display it. Can probably use your function 
      // userId = generateChatId(currUser.uid, friend.uid));
      // Get the last message from the chatId, update it when it changes. Probably has to listen
      
    // You should change the friend.gym to the last messsage sent by the user as in Figma
    return (
        <Flex>
            <Row alignItems="center" space="sm">
                <Avatar m={2} size= "xl" source={friend.icon ? {uri: friend.icon} : require("@/assets/images/default-profile-pic.png")} />
                <Column>
                <Row justifyContent= {"space-between"} >
                    <Column overflow="hidden" width="190">    
                        <Text color= "trueGray.900" fontSize="md" fontWeight="bold" isTruncated>{friend.name}</Text>
                        <Text color= "trueGray.900" fontSize="sm" isTruncated>{friend.gym}</Text>
                    </Column>
                    <Spacer/>
                </Row>
                </Column>
            </Row>
        </Flex>
    );
  };

  export default ChatPreview;