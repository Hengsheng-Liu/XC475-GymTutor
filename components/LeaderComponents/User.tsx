import { Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Avatar, HStack, VStack } from 'native-base'
import { getUserIcon, IUser } from '../FirebaseUserFunctions'
interface UserProps {
    User: IUser,
    rank: number,
    SortMethod : boolean,
}
export default function LeaderBoard({User, rank, SortMethod}: UserProps) {
    const [profilePic, setProfilePic] = useState<string>();
    const [quantity, setQuantity] = useState<number>(0);
    const [description, setDescription] = useState<string>("Likes");

    useEffect(() => {
        const fetchIcon = async () => {
            const url = await getUserIcon(User.icon);
            setProfilePic(url);
        }
        fetchIcon();
        SortMethod ? setQuantity(User.checkInHistory.reduce((acc, curr) => acc + (curr.likes ? curr.likes.length : 0), 0)) : setQuantity(User.checkInHistory.length);
        setDescription(SortMethod ? "Likes" : "Check-ins");
    }, [SortMethod]);
    return (
        (rank <= 3) ?
        <VStack borderWidth={1}>
            <Text>{rank}</Text>
            <Avatar source = {{uri: profilePic}}></Avatar>
            <Text>{quantity} {description}</Text>
        </VStack>
        :
        <HStack borderWidth={1}>
            <Text>{rank}</Text>
            <Avatar source = {{uri: profilePic}}></Avatar>
            <Text>{quantity} {description}</Text>
        </HStack>
    )
  }
