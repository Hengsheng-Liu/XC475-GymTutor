import React, { useState, useEffect, useRef } from 'react';
import { View, 
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
    const [users, setUsers] = useState<IUser[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const {currUser} = useAuth();
    if (!currUser) return;
    
    // TODO: Display user preview when clicked
    const handleUserClick = (user: IUser) => {
        // Do something when user is clicked
        // Open Profile
    };

    // Get users from database using filters
    const handleGetUsers = async () => {
        // updateUsers(); // Uncomment when we want to use it to add fields
        setLoading(true);
        const fetchedUsers = await getUsers(currUser.uid, gym);
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
                <TextInput
                    placeholder="Enter your gym"
                    value={gym}
                    onChangeText={setGym}
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Search" onPress={handleGetUsers} />
                    <View style={styles.buttonSeparator} />
                    <Button title="Friends List" onPress={() => router.push("/Friends")} />
                    <View style={styles.buttonSeparator} />
                    <Button title="Notification List" onPress={() => router.push("/Notifications")} />
                </View>                
                <Text> Explore new users! </Text>
                    {users.map((user, index) => (
                        <TouchableOpacity key={index} style={styles.userContainer} onPress={() => handleUserClick(user)}>
                            <View style={styles.profilePicture}></View>
                            {/* Once we have an image, I can put this */}
                            {/* <Image
                                source={{ uri: user.profilePictureURL }}
                                style={styles.profilePicture}
                            /> */}
                            <View style={styles.userInfo}>
                                <Text>Name: {user.name}</Text>
                                <Text>Email: {user.email}</Text>
                                <Text>Gym: {user.gym}</Text>
                                <Text>UID: {user.uid}</Text>
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