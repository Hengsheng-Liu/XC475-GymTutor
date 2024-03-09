import { Text, View } from 'react-native'
import React, { Component } from 'react'
import FirebaseDataDisplay from '@/components/DisplayUsers'



import { NativeBaseProvider,extendTheme } from 'native-base';

export default function HomeScreen() {
    const theme = extendTheme({
        components:{
            Text:{
                baseStyle:{
                    color: "#F0F9FF",
                }
            },
            Heading:{
                baseStyle:{
                    color: "#F0F9FF",
                }
            },
        }
    });

    return (
        <NativeBaseProvider theme = {theme}>
                <FirebaseDataDisplay/>
        </NativeBaseProvider>

        
    )
}
