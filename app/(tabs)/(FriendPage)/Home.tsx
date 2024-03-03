import { Text, View } from 'react-native'
import React, { Component } from 'react'
import FirebaseDataDisplay from '@/components/DisplayUsers'

import { NativeBaseProvider, useTheme } from 'native-base';

export default function HomeScreen() {
    
    return (
        <NativeBaseProvider>
            <FirebaseDataDisplay />
        </NativeBaseProvider>

        
    )
}
