import React from 'react'
import { StyleSheet,ScrollView } from 'react-native'
import { NativeBaseProvider,extendTheme } from 'native-base';
import Title from './SelectGymComponents/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import Gym from './SelectGymComponents/Gym';
export default function SelectGym() {
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
          <ScrollView>
          <SafeAreaView style = {styles.conatiner}>
            <Title/>
            <Gym/>
            <Gym/>
            <Gym/>
            <Gym/>
            <Gym/>
            <Gym/>
          </SafeAreaView>
          </ScrollView>
        </NativeBaseProvider>

    )
}
const styles = StyleSheet.create({
  conatiner:{
    flex:1, 
    backgroundColor: "#0369A1", 
  }
})
