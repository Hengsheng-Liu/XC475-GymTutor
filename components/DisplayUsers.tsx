import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import {firestore} from '../firebaseConfig';
import { limit, where, query, collection, addDoc, doc, getDocs, updateDoc, arrayUnion, setDoc, Query } from 'firebase/firestore';
import { useAuth } from "../Context/AuthContext";

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [users, setUsers] = useState<any[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const [endReached, setEndReached] = useState<boolean>(false); // State to track if end of list is reached
    const { User} = useAuth();
    const [UserID, setUserId] = useState<string>('');

    const styles = StyleSheet.create({
        userContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            marginVertical: 5,
            backgroundColor: '#eee',
            borderRadius: 5,
            borderBottomWidth: 1,
            borderColor: 'lightgray',
        },
        profilePicture: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'lightgray',
            marginRight: 10,
        },

        userInfo: {
            flex: 1,
        },
        userInfoText: {
            marginBottom: 5,
        },
            addFriendButton: {
            backgroundColor: 'lightblue',
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
        },
        addFriendButtonText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        scrollViewContent: {
            flexGrow: 1,
            justifyContent: 'flex-start',
        },
    });

    const handleUserClick = (user: any) => {
        // Do something when user is clicked
    };


    // Fetch users when component mounts
    const fetchUsers = async () => {
        //if (loading || endReached) return;

        setLoading(true);
        try {
            const fetchedUsers = await queryUsers(gym);
            setUsers(fetchedUsers); // Append fetched names to existing names
            if (fetchedUsers.length < 1) {
                setEndReached(true); // Set endReached to true if no more names to fetch
            }
        } catch (error) {
            console.error('Error fetching names:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to query users from Firestore
    const queryUsers = async (gym?: string) => {
        const db = firestore;
        let usersQuery;

        if (gym) {
            usersQuery = query(
                collection(db, 'Users'),
                where('Gym', '==', gym),
                limit(10)
            );
        } else {
            usersQuery = query(collection(db, 'Users'), limit(10));
        }

        try {
            const querySnapshot = await getDocs(usersQuery);
            const usersData: any[] = []; // Initialize an array to store names

            querySnapshot.forEach(snap => {
                const userData = snap.data();
                const userId = snap.id;
                if (User){
                    if (userData.uid == User.uid){
                        setUserId(userId);
                        console.log(userId, userData);
                    } else{
                        usersData.push({ id: userId, ...userData });
                    }
                }
            });

            // console.log(usersData);
            return usersData; // Return the list of users
        } catch (error) {
            console.error('Error querying users:', error);
            throw error; // Throw error for handling in the caller function
        }
    };

    // Function to handle end of list reached
    const handleEndReached = () => {
        if (!endReached) {
            fetchUsers();
        }
    };

    const addFriend = async (userUid: string, friendUid: string) => {
        const db = firestore;
        const userRef = doc(db, 'Users', userUid);
        const friendRef = doc(db, 'Users', friendUid);

        try {
            await updateDoc(userRef, { friends: arrayUnion(friendUid) });
            await updateDoc(friendRef, { friends: arrayUnion(userUid) });
            console.log('Friend added successfully');
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleAddFriend = (userId: string, friendId: string) => {
        console.log(userId, friendId);
        addFriend(userId, friendId);
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

                <ScrollView>
                    {users.map((user, index) => (
                        <TouchableOpacity key={index} style={styles.userContainer} onPress={() => handleUserClick(user)}>
                            <View style={styles.profilePicture}></View>
                            <View style={styles.userInfo}>
                                <Text>Name: {user.name}</Text>
                                <Text>Email: {user.email}</Text>
                                <Text>Gym: {user.Gym}</Text>
                            </View>
                            <TouchableOpacity style={styles.addFriendButton} onPress={() => handleAddFriend(UserID, user.id)}>
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



// TO DO: Add interface
// export interface IUniversityClass {
//     classId: string;
//     title: string;
//     description: string;
//     meetingTime: string;
//     meetingLocation: string;
//     status: string;
//     semester: string;
//   }