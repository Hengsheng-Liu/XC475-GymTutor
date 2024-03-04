import React, { useState, useEffect, useRef } from 'react';
import { View, 
    Image,
    Text, 
    TextInput, 
    Button, 
    FlatList,
    ScrollView, 
    ActivityIndicator, 
    TouchableOpacity, 
    StyleSheet } from 'react-native';
import {firestore} from '../firebaseConfig';
import { 
    limit, 
    where, 
    query, 
    collection, 
    addDoc, 
    doc, 
    getDoc,
    getDocs, 
    updateDoc, 
    arrayUnion, 
    setDoc, 
    Query } from 'firebase/firestore';
import { useAuth } from "../Context/AuthContext";
import { IUser, getUsers, updateUsers} from './FirebaseDataService';
import { handleSendFriendRequest, canAddFriend, sendFriendRequest} from "./HandleFriends"
import { styles } from './DisplayUsersStyles';
import { router } from "expo-router";

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

        // console.log("Change gym functionality placeholder");
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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled" // Ensures taps outside of text inputs dismiss the keyboard
                keyboardDismissMode="on-drag" // Dismisses the keyboard when dragging the ScrollView
                >
                <View style={styles.gymContainer}>
                    <TouchableOpacity onPress={handleGymClick}>
                        <View style={styles.textContainer}>
                            <Text style={styles.gymText}>{gym}</Text>
                            <Text style={styles.changeGymText}>Click here to change your gym</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Notifications")} >
                        <Image source={require('../assets/images/bell_icon.png')} style={styles.bellIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchBarContainer}>
                    <TouchableOpacity onPress={handleSearchUsers} >
                        <Image source={require('../assets/images/search_icon.png')} style={styles.searchIcon} />
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
                        <Image source={require('../assets/images/filter_icon.png')} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Friends")} >
                        <Image source={require('../assets/images/profile_icon.png')} style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>                
                    {users.map((user, index) => (
                        <TouchableOpacity key={index} style={styles.userContainer} onPress={() => handleUserClick(user)}>
                            <View style={styles.profilePicture}></View>
                            <Image source={require('../assets/images/active_icon.png')} style={styles.activeIcon} />
                            {/* Once we have an image, I can put this */}
                            {/* <Image
                                source={{ uri: user.profilePictureURL }}
                                style={styles.profilePicture}
                            /> */}
                            <View style={styles.userInfo}>
                                <Text style={styles.nameStyle} >{user.name}</Text>
                                <Text style={styles.userInfoStyle} >Email: {user.email}</Text>
                                <Text style={styles.userInfoStyle} >Gym: {user.gym}</Text>
                            </View>
                            {/* Conditionally render the add friend button */}
                            {canAddFriend(currUser.uid, user) && (
                                <TouchableOpacity 
                                    style={styles.addFriendButton} 
                                    onPress={() => handleSendRequest(currUser.uid, user)}>
                                    <Text style={styles.addFriendButtonText}>+</Text>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
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