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
        width={"1/4"}
        onPress={() => router.push({pathname:"/AchievementPage",params:{edit:true,display}})}
        _pressed={{ opacity: 0.5 }}
        >
        
        <Flex
       height={"24"}
       borderRadius={10}
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={"muted.200"}
        >
            <AntDesign name="plus" size={36} color="black" />
        </Flex>
        </Pressable>
    );
}