import { View } from 'react-native'
import React from 'react'
import FirebaseDataDisplay from '@/app/(tabs)/(HomePage)/HomeComponents/DisplayUsers'
import theme from '@/components/theme';

import { NativeBaseProvider,extendTheme } from 'native-base';

export default function HomeScreen() {
    
    return (
        <NativeBaseProvider theme = {theme}>
            <View>
                <FirebaseDataDisplay/>
            </View>
        </NativeBaseProvider>

        
    )
}
