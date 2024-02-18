import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {firestore} from '../firebaseConfig';
import { limit, where, query, collection, addDoc, doc, getDocs, setDoc, Query } from 'firebase/firestore';

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [names, setNames] = useState<string[]>([]); // State to store names

    // Fetch names when component mounts
    async function fetchNames() {
        const fetchedNames = await queryUsers(gym);
        setNames(fetchedNames); // Update state with fetched names
    }

    return (
        <View>
            <TextInput
                placeholder="Enter your gym"
                value={gym}
                onChangeText={setGym}
                style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
            />
            <Button title="Search" onPress={fetchNames} />

            <Text> List of Users: </Text>
            {/* Map over names array and render each name as a Text component */}
            {names.map((name, index) => (
                <Text key={index}>{name}</Text>
            ))}
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