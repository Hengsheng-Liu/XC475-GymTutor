import React, { useState, useEffect, useCallback } from 'react'
import { Flex, Spacer, Row, Column, Text, Avatar } from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions';
import { useAuth } from "@/Context/AuthContext";
import { generateChatId } from '@/app/(tabs)/(MessagePage)/data';
import { firestore } from '../../firebaseConfig'
import { getDoc, doc, collection } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
import { getUserPicture } from '@/components/FirebaseUserFunctions';

interface FriendProps {
    friend: IUser;
}

const ChatPreview: React.FC<FriendProps> = ({ friend }) => {
    const { currUser } = useAuth();
    const [newestMessage, setNewestMessage] = useState('');
    const [friendIcon, setFriendIcon] = useState<string>(); 
    if (!currUser) return;

    useEffect(() => {
        async function fetchIcon() {
            if (currUser && friend.icon !== "") {
              try {
                const url = await getUserPicture(friend.icon, "Avatar");
                // console.log("Found Icon URL: ", url);
                setFriendIcon(url);
              } catch (error) {
                console.error("Failed to fetch friend icon:", error);
                // Handle the error e.g., set a default icon or state
                const url = await getUserPicture("Icon/Default/Avatar.png", "Avatar");
                console.log("Used default Icon URL: ", url)
                setFriendIcon(url);
              }
            } else {
            const url = await getUserPicture("Icon/Default/Avatar.png", "Avatar");
            // console.log("Used default Icon URL: ", url)
            setFriendIcon(url);
          }
        }

        if (currUser) {
            fetchIcon();
        }
    }, [currUser, friend.uid,friend.icon]); // Depend on currUser and friend.uid

    useFocusEffect(
        useCallback(() => {
            const fetchNewestMessage = async () => {
                if (!currUser) return;

                const chatId = generateChatId(currUser.uid, friend.uid);
                const chatRef = doc(collection(firestore, 'Chat'), chatId);

                try {
                    const chatDoc = await getDoc(chatRef);
                    if (chatDoc.exists()) {
                        setNewestMessage(chatDoc.data().newestMessage || 'No messages yet');
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching document: ", error);
                }
            };

            fetchNewestMessage();
        }, [currUser, friend.uid, firestore])
    );

    if (!currUser) return;

    // TODO: Get the last message from the user and display it. Can probably use your function 
    // userId = generateChatId(currUser.uid, friend.uid));
    // Get the last message from the chatId, update it when it changes. Probably has to listen

    // You should change the friend.gym to the last messsage sent by the user as in Figma
    return (
        <Flex>
            <Row alignItems="center" space="sm">
                <Avatar m={2} size="xl" source={{uri: friendIcon}} />
                <Column>
                    <Row justifyContent={"space-between"} >
                        <Column overflow="hidden" width="190">
                            <Text color="trueGray.900" fontSize="md" fontWeight="bold" isTruncated>{friend.name}</Text>
                            <Text color="trueGray.900" fontSize="sm" isTruncated>{newestMessage}</Text>
                        </Column>
                        <Spacer />
                    </Row>
                </Column>
            </Row>
        </Flex>
    );
};

export default ChatPreview;