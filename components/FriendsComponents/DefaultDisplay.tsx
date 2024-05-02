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
        <Pressable 
        width={"1/4"}>
        <Flex
        height={"24"}
        borderRadius={10}
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={"muted.200"}
        >
        </Flex>
        </Pressable>
    );
}