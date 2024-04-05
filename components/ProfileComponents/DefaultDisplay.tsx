import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Pressable } from 'native-base';
import { router } from 'expo-router';
import { Box,Flex} from 'native-base';
interface DefaultDisplayProps {
    display: string[];
}
export default function DefaultDisplay(
    { display }: DefaultDisplayProps
) {
    return (
        <Flex
        width={"1/4"}
        height={"24"}
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={"muted.200"}
        >
            <Pressable onPress={() => router.push({pathname:"/AchievementPage",params:{edit:true,display}})}>
            <AntDesign name="plus" size={24} color="black" />
            </Pressable>
        </Flex>
    );
}