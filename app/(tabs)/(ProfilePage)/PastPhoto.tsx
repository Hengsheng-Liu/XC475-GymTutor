import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Flex } from 'native-base';
import React, { useEffect, useState } from 'react';
import { GetUserPicture } from '@/components/FirebaseUserFunctions';
import { Stack, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function PastPhoto() {
    const { pictureUrl,title } = useLocalSearchParams();
    const [url, setUrl] = useState<string | null>("");
    const navigation = useNavigation();
    useEffect(() => {
        console.log('pictureUrl:', pictureUrl);
        const fetchPictureUrl = async () => {
            try {
                const url = await GetUserPicture(pictureUrl); 
                setUrl(url);
            } catch (error) {
                console.error('Error fetching picture URL:', error);
            }
        };
        navigation.setOptions({ title: title });
        fetchPictureUrl();
    }, [pictureUrl,navigation]); 
    return (
        <View style={styles.container}>
            {url && (
                <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: url }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
