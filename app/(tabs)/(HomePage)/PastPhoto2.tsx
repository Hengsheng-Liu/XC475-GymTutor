import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Flex } from 'native-base';
import React, { useEffect, useState } from 'react';
import { getUserPicture } from '@/components/FirebaseUserFunctions';
import { Stack, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
            <View style ={styles.header}>
                <Ionicons 
                style={{flex:1}}
                name="chevron-back-sharp" size={30} color="black" onPress={() => router.back()} />
                <Text style={styles.title}>{title}</Text>
                <View style={{flex:1}}>
                </View>
            </View>
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
