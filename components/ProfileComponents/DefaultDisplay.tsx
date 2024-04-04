import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Box,Flex} from 'native-base';
export default function DefaultDisplay() {
    return (
        <Flex
        width={"1/4"}
        height={"24"}
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={"muted.200"}
        >
            <AntDesign name="plus" size={24} color="black" />
        </Flex>
    );
}