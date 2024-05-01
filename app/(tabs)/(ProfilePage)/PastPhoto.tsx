import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Flex, Spacer, Box, Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { getUserPicture } from '@/components/FirebaseUserFunctions';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PastPhoto() {
    const { pictureUrl,title } = useLocalSearchParams();
    const [url, setUrl] = useState<string | undefined>("");
    useEffect(() => {
        const fetchPictureUrl = async () => {
            try {
                const url = await getUserPicture(pictureUrl, "checkIn"); 
                setUrl(url);
            } catch (error) {
                console.error('Error fetching picture URL:', error);
            }
        };
        fetchPictureUrl();
    }, [pictureUrl]); 
    return (
        <SafeAreaView style={styles.container}>
            <Flex p={15} mt={8} flexDirection={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Spacer />
            <Box>
                <Heading fontSize="lg" color="trueGray.800" pr="2">{title}</Heading>
            </Box>
            <Spacer/>
            <TouchableOpacity>
                <FontAwesome name="chevron-left" size={24} color='#f2f2f2' />
            </TouchableOpacity>
            </Flex>
            {url && (
                <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: url }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f2f2f2',
        width: '100%',        
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flex:1
    },

});
