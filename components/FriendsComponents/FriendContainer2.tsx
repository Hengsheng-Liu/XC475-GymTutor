import React, { useState } from 'react'
import { Row, Column, Button, Pressable, Text, Spacer, Avatar } from 'native-base'
import { IUser } from '@/components/FirebaseUserFunctions';
import { router } from 'expo-router';
import { useAuth } from '@/Context/AuthContext';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { findOrCreateChat } from '../../app/(tabs)/(MessagePage)/data';
import { globalState } from '../../app/(tabs)/(MessagePage)/globalState';


interface FriendProps {
  friend: IUser;
  fetchData: () => void;
}

const friendContainer: React.FC<FriendProps> = ({ friend, fetchData }) => {

  const [isPressed, setIsPressed] = useState<boolean>(false);
  const { currUser, updateCurrUser, updateFriend } = useAuth();


  const handleUserClick = async (friend) => {
    setIsPressed(true);
    await updateFriend(friend);
    console.log(findOrCreateChat(currUser?.uid, friend.uid));
    globalState.user = friend; // Set the selected user in the global state
    router.navigate("ChatPage"); // Then navigate to ChatPage
  };

  // Function to remove a friend
  const removeFriend = async (userUID: string, friendUID: string) => {
    const userRef = doc(firestore, 'Users', userUID);
    const friendRef = doc(firestore, 'Users', friendUID);

    try {
      if (currUser) {
        const updatedUser = { ...currUser };
        const friendIndex = updatedUser.friends.indexOf(friendUID);
        updatedUser.friends.splice(friendIndex, 1);
        updateCurrUser(updatedUser);
      }
      // Remove friendUid from user's friends list
      updateDoc(userRef, { friends: arrayRemove(friendUID) });

      if (friend) {
        const updatedFriend = { ...friend };
        const userIndex = updatedFriend.friends.indexOf(userUID);
        updatedFriend.friends.splice(userIndex, 1);
        updateFriend(updatedFriend);
      }
      // Remove userId from friend's friends list
      updateDoc(friendRef, { friends: arrayRemove(userUID) });

      console.log('Friend removed successfully');
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
    fetchData();
  };

  return (
    <Pressable
      onPress={() => handleUserClick(friend)}
      onPressOut={() => setIsPressed(false)}
      p={3} mb={2}
      borderRadius="xl" borderWidth={1} borderColor="trueGray.50" shadow="3"
      bg={isPressed ? "trueGray.200" : "trueGray.50"} // Change background color on hover
    >
      <Row alignItems="center" space="sm">
        <Avatar size="md" source={friend.icon ? { uri: friend.icon } : require("@/assets/images/default-profile-pic.png")} />
        <Row justifyContent="space-between" alignItems="center" flex={1}>
          <Column>
            <Text color="trueGray.900" fontSize="lg" fontWeight="bold">{friend.name}</Text>
          </Column>
          <Spacer />
          {currUser && < Button backgroundColor="#F97316" height={5} pt={0} pb={0} alignItems="center" onPress={() => removeFriend(currUser.uid, friend.uid)}>
            <Text color="#FFF" fontSize="xs" fontWeight="bold">  Unfollow  </Text>
          </Button>
          }
        </Row>
      </Row>
    </Pressable>
  );
};

export default friendContainer;