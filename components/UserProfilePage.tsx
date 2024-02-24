import { StyleSheet, Text, View, SafeAreaView, Image, Button, Alert, Dimensions } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { firestore,auth} from "../firebaseConfig";
import { limit, where, query, collection, addDoc, doc, getDocs, getDoc, updateDoc, arrayUnion, setDoc, Query } from 'firebase/firestore';
import {useAuth} from"../Context/AuthContext";

    // const fetch = async () => {
    //     const [users, setUsers] = useState([]);
    //     const usersCollection =  (firestore as any).collection('Users');

    //     const querySnapshot = await usersCollection.get();
    //     console.log(querySnapshot);
    //     querySnapshot.forEach((doc: any) => {
    //         console.log(doc.id, ' => ', doc.data());
       
    //     });

    // }

    // const fetchUserData = async () => {
    //     try {
    //         const currentUser = auth.currentUser;
    //         if (currentUser) {
    //             const userId = currentUser.uid;
                
    //             const userRef = (firestore as any).collection('Users').doc(userId);
    //             const userDoc = await userRef.get();
    //             if (userDoc.exists) {
    //                 console.log('User data:', userDoc.data());
    //                 const userData = userDoc.data();
    //                 const userName = userData.name;
    //                 console.log('name', userName);
    //                 return userName;
                    
    //             } else {
    //                 console.log('No such user document!');
    //             }
    //         } else {
    //             console.log('No user signed in');
    //         }
    //     return null;
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // }

    // const fetch = () => {
    //     const [userName, setUserName] = useState<string>("");
    //     console.log('check1');
    //     useEffect(() => {
    //         const fetchData = async () => {
    //             try {
    //                 const name = await fetchUserData();
    //                 if (name) {
    //                     console.log('aasdfasdf', name);
    //                     setUserName(name);
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         };
    //         fetchData();
    //     }, []);

    //     return (
    //         <View style={styles.container}>

    //         userName
    //         </View>
    //     );
    // };

    const ProfilePage = () => {
        // const [userName, setUserName] = useState("");

        // useEffect(() => {
        //     const fetchUserData = async () => {
        //         try {
        //             const currentUser = auth.currentUser;
        //             if (currentUser) {
                        
        //                 const userId = currentUser.uid;
        //                 // const userName = userId

        //           //  https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_userhttps://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
        //                 const userRef = collection(firestore, "Users", userId);
        //                 const userDoc = await userRef.getDoc();
        //                 if (userDoc.exists) {
        //                     const userData = userDoc.data();
        //                     const userName = userData.name;
        //                     setUserName(userName); 
        //                 } else {
        //                     console.log('No such user document');
        //                 }
        //             } else {
        //                 console.log('No user signed in');
        //          }
        //         } catch (error) {
        //             console.error('Error fetching user data:', error);
        //         }
        //     };
        //     fetchUserData();
        // }, []);


// // most recent one

        const [userName, setUserName] = useState<string>("");
        const {User} = useAuth(); 
        console.log('user', User);


        useEffect(() => {

        if (User?.uid) {
            //const email = user.email;
            //console.log("email", email);
            //console.log("uid", user.uid );
            const docRef = doc(firestore, "Users", User.uid);
            console.log("uid", User.uid);
            
            
            
            const getDocument = async() => {
                console.log("docRef", docRef);

                const docSnap = await getDoc(docRef);
                console.log("docSnap", docSnap.data());

                if (docSnap && docSnap.exists()) {
                    console.log("docSnap", docSnap.data());
                }
                else {
                    console.log("docSnap doesnt exist");
                }
            };

            // after i figure out docSnap, I can get name by doing docSnap.getString("name");
            // https://stackoverflow.com/questions/48492993/firestore-get-documentsnapshots-fields-value
            // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentSnapshot
            

            getDocument();

        }
       }, [User]);


   //         <Text style={styles.nameText}>{displayName ? displayName : "Loading..."}</Text>


    return (
    <View style={styles.container}>

   

        <Image 
        source={ 
            require('../assets/images/bob.png')}
        style={styles.image}
        />
        <Text style={styles.description}>Location: </Text>

        <Text style={styles.description}>Description: </Text>


        <Button 
        color="orange"
        title="Send friend request (its a button btw)"
        onPress={() => Alert.alert("Friend request sent!", "epic moment", [
            {text: "nice", onPress: () => console.log("pressed 'nice'")},
            {text: "amazing"}
        ])}
        >
    
        </Button>

    </View>

        
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    image: {
        flex: 1,
        width: 200,
        height: 200,
        resizeMode: 'contain',
        justifyContent: 'center',       
    },
    titleContainer: {
        flex: 1.2,
        justifyContent: "center",
      },
      nameText: {
        fontSize: 45,
        textAlign: "center",
        fontWeight: "200",
      },
      description: {
        fontSize: 20,
        textAlign: "center",
      },
      loginTextField: {
        borderBottomWidth: 1,
        height: 60,
        fontSize: 30,
        marginVertical: 10,
        fontWeight: "300",
        marginBottom: 20,
      },
      mainContent: {
        flex: 6,
      },
      button: {
        backgroundColor: "orange",
        fontSize: 20,
        textAlign: "center",
        
      }
});


export default ProfilePage;