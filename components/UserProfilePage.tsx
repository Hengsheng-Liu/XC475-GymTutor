import { StyleSheet, Text, View, SafeAreaView, Image, Button, Alert, Dimensions } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { firestore,auth} from "../firebaseConfig";
import { limit, where, query, collection, addDoc, doc, getDocs, getDoc, updateDoc, arrayUnion, setDoc, Query } from 'firebase/firestore';
import {useAuth} from"../Context/AuthContext";


    const ProfilePage = () => {

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
                    const name = await docSnap.get("name");

                    setUserName(name);
                    
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

       console.log("username is ", userName);



    return (
    <View style={styles.container}>

        <Text style={styles.nameText}>{userName ? userName : "Loading..."}</Text>

        <Image 
        source={ 
            require('../assets/images/bob.png')}
        style={styles.image}
        />
        <Text style={styles.description}>Location: </Text>

        <Text style={styles.description}>Description: </Text>

        <Button 
        color="orange"
        title="Settings"
        onPress={() => Alert.alert("Friend request sent!", "epic moment", [
            {text: "nice", onPress: () => console.log("pressed 'nice'")},
            {text: "amazing"}
        ])}
        >
        </Button>
    </View> 
    )
};

export default ProfilePage;

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
        color: "black",
      },
      nameText: {
        fontSize: 45,
        textAlign: "center",
        fontWeight: "200",
        color: "black",
      },
      description: {
        fontSize: 20,
        textAlign: "center",
        color: "black",
      },
  
      mainContent: {
        flex: 6,
      },
      button: {
        backgroundColor: "orange",
        fontSize: 20,
        textAlign: "center",
        color: "black",
        
      }
});


