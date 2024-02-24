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
import { IUser, getUsers, addFriend} from './FirebaseDataService';
import { styles } from './DisplayUsersStyles';

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [users, setUsers] = useState<IUser[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    // TODO: Switch User to currUser?
    const { User} = useAuth();

    // TO DO: Display user preview when clicked
    const handleUserClick = (user: IUser) => {
        // Do something when user is clicked
        // Open Profile
    };

    // Function to fetch users 
    const fetchUsers = async () => {
        if (loading) return;

        setLoading(true);
        try {
            // Fetch users and save them
            const fetchedUsers = await getUsers(gym);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching names:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle add friend function
    const handleAddFriend = (userUID: string, friendUID: string) => {
        addFriend(userUID, friendUID);
    };

    let content = null;
    if (User){
        content = (
            <View>
                <TextInput
                    placeholder="Enter your gym"
                    value={gym}
                    onChangeText={setGym}
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
                />
                <Button title="Search" onPress={fetchUsers} />

                <Text> List of Users: </Text>

                <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                scrollEnabled={true}>
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
                                <Text>Gym: {user.Gym}</Text>
                            </View>
                            <TouchableOpacity style={styles.addFriendButton} onPress={() => handleAddFriend(User.uid, user.uid)}>
                                <Text style={styles.addFriendButtonText}>+</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
                </ScrollView>
            </View>
        );
    }   else {
        content = <Text>No user signed in.</Text>;
    }

    return <View>{content}</View>;
};
export default FirebaseDataDisplay;

async function addUser(uid:String, email:String){
    const db = firestore;
    const User = addDoc(collection(db, "Users"), {
        uid: uid,
        email: email,
        name: "",
        friends: [],
        Gym: "",
        CheckInHistory: [],
        icon: "",
        Achievement: [],
        GymExperience: "0",
      });

}

async function getUser(){
    const db = firestore;

}
