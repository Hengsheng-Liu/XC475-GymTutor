import React, { useState, useEffect } from 'react';
import { View, 
    Image,
    Text, 
    TextInput, 
    ScrollView, 
    ActivityIndicator, 
    TouchableOpacity } from 'react-native';
import {firestore} from '../../../../firebaseConfig';
import { doc, updateDoc, } from 'firebase/firestore';
import { useAuth } from "../../../../Context/AuthContext";
import { IUser, getUsers, updateUsers} from '../../../../components/FirebaseDataService';
import { handleSendFriendRequest, canAddFriend } from "../FriendsComponents/FriendFunctions"
import { styles } from './DisplayUsersStyles';
import { router } from "expo-router";
import UserPreview from './UserPreview';
import { NativeBaseProvider } from 'native-base';
import theme from '@/components/theme';
import Header from '../../(HomePage)/HomeComponents/Header';

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [users, setUsers] = useState<IUser[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const {currUser} = useAuth();
    if (!currUser) return;
    
    useEffect(() => {
        if (currUser) {
            // Fetch gym name for current user
            const userGym = currUser.gym || "Default Gym"; // Use default name if user has no gym
            setGym(userGym);
        }
    }, [currUser]);

    // TODO: Function to handle gym click
    const handleGymClick = async () => {
        // Placeholder function to change gym
        setGym(searchTerm);
        const userDocRef = doc(firestore, 'Users', currUser.uid);
        await updateDoc(userDocRef, {gym: searchTerm});
    };

    // TODO: Display user preview when clicked
    const handleUserClick = (user: IUser) => {
        // Do something when user is clicked
        // Open Profile
    };

    // Get users from database using filters
    const handleGetUsers = async () => {
        //updateUsers(); // Uncomment when we want to use it to add fields
        setLoading(true);
        const fetchedUsers = await getUsers(currUser.uid, gym);
        setUsers(fetchedUsers);
        setLoading(false);
    };

    // Search users by name
    const handleSearchUsers = async () => {
        setLoading(true);
        // const fetchedUsers = await getUsers(currUser.uid, gym, [['name', '>=', searchTerm]]);
        const fetchedUsers = await getUsers(currUser.uid);
        setUsers(fetchedUsers);
        setLoading(false);
    };

    // Send friend Requests
    const handleSendRequest = (userUID: string, friend: IUser) => {
        handleSendFriendRequest(userUID, friend);
        handleGetUsers();
    };

    let content = null;
    if (currUser){
        content = (
            <ScrollView>
                <Header currUser={currUser}/>
                <View style={styles.searchBarContainer}>
                    <TouchableOpacity onPress={handleSearchUsers} >
                        <Image source={require('@/assets/images/search_icon.png')} style={styles.searchIcon} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Spot someone in this gym"
                        value= {searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchBar}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleGetUsers} >
                        <Image source={require('@/assets/images/filter_icon.png')} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Friends")} >
                        <Image source={require('@/assets/images/profile_icon.png')} style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>                
                    {users.map((user, index) => (
                        < UserPreview friend={user} key={user.uid}/>
                    ))}
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </ScrollView>
        );
    }   else {
        content = <Text>No user signed in.</Text>;
    }

    return <View>{content}</View>;
};
export default FirebaseDataDisplay;