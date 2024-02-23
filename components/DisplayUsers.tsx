import React, { useState, useEffect } from 'react';
import { View, 
    Text, 
    TextInput, 
    Button, 
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

const FirebaseDataDisplay = () => {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [users, setUsers] = useState<any[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const [endReached, setEndReached] = useState<boolean>(false); // State to track if end of list is reached
    // TODO: Switch User to currUser
    const { User} = useAuth();
    // TODO: Get this ID from useAuth instead?) of the whole user
    const [UserID, setUserId] = useState<string>('');

    // Temporary designs for UI
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

    // TO DO: Display user preview when clicked, switch typeof thing
    const handleUserClick = (user: typeof User) => {
        // Do something when user is clicked
        // Open Profile
    };

    // Function to fetch users 
    const fetchUsers = async () => {
        if (loading || endReached) return;

        setLoading(true);
        try {
            // Fetch users and save them
            const fetchedUsers = await queryUsers(gym);
            setUsers(fetchedUsers);

            // TODO: Should this number be relative to screen size?
            // Also has error, won't display more users once there is less than 5
            // if (fetchedUsers.length < 5) { 
            //     setEndReached(true); // Set endReached to true if no more names to fetch
            // }
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

        // Query users from a specific gym, or all users if none is given
        // TODO: Only query some of them
        if (gym) {
            usersQuery = query(
                collection(db, 'Users'),
                where('Gym', '==', gym),
                // limit(10)
            );
        } else {
            usersQuery = query(
                collection(db, 'Users'), 
                //limit(10)
            );
        }

        try {
            // Query each user and retrieve their data
            const querySnapshot = await getDocs(usersQuery);
            const usersData: any[] = []; 

            querySnapshot.forEach(snap => {
                const userData = snap.data();
                const userId = snap.id;

                // Do not show current user
                if (User){
                    if (userData.uid !== User.uid){
                        usersData.push({ id: userId, ...userData });
                    }
                    // if (userData.uid == User.uid){
                    //     // TODO: May not have to do this once we have UserID
                    //     setUserId(userId); 
                    //     console.log(userId, userData);
                    // } else{
                    //     usersData.push({ id: userId, ...userData });
                    // }
                }
            });

            // Return list of Users
            return usersData; 

        } catch (error) {
            // Throw error for handling in the caller function
            console.error('Error querying users:', error);
            throw error; 
        }
    };

    // Function to handle end of list reached
    // TODO: Doesn't work right
    const handleEndReached = () => {
        if (!endReached) {
            fetchUsers();
        }
    };

    // Function to add Friends
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
        console.log("Congratulations, you've successfully added: ", userId, friendId);
        addFriend(userId, friendId);
    };

    
    
    let content = null;
    if (User){ // Necessary? display info if there is a user.
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
