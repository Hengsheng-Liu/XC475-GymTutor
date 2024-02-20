import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import {firestore} from '../firebaseConfig';
import { limit, where, query, collection, addDoc, doc, getDocs, updateDoc, arrayUnion, setDoc, Query } from 'firebase/firestore';

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [users, setUsers] = useState<any[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const [endReached, setEndReached] = useState<boolean>(false); // State to track if end of list is reached

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
                usersData.push(userData);
            });

            console.log(usersData);
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

    const handleAddFriend = (userUid: string, friendUid: string) => {
        addFriend(userUid, friendUid);
    };

    return (
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
                    <View key={index} style={{ marginBottom: 40 }}>
                        <Text>Name: {user.name}</Text>
                        <Text>Email: {user.email}</Text>
                        <Text>Gym: {user.Gym}</Text>
                        <Button title="Add Friend" onPress={() => handleAddFriend("123", user.uid)} />
                    </View>
                ))}
                {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </ScrollView>
        </View>
    );
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

async function queryUsers(Gym?: string){
    const db = firestore;
    let usersQuery;

    if (Gym) {
        usersQuery = query(
            collection(db, "Users"),
            where("Gym", "==", Gym),
            limit(10)
        )
    } else {
        usersQuery = query(
            collection(db, "Users"),
            limit(10)
        )
    }

    try {
        const queries = await getDocs(usersQuery);
        const names: string[] = []; // Initialize an array to store names

        queries.forEach((snap) => {
            const name = snap.data()["name"];
            if (name) {
                names.push(name); // Push name to the array
            }
        });

        console.log(names); // Output the list of names
        return names; // Return the list of names
    } catch (error) {
        console.error('Error querying users:', error);
        return []; // Return an empty array in case of error
    }
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