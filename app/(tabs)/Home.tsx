import React, { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useAuth } from '../../Context/AuthContext'; 
import { View,Text} from '@/components/Themed';
export default function HomeScreen() {
    /*
    const { User } = useAuth();

    useEffect(() => {
        // Ensure User is not undefined
        if (User?.uid) {
            const docRef = doc(firestore, "Users", User.uid);
            console.log(User.uid); 
            const getDocument = async () => {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            };
            getDocument().catch(console.error);
        }
    }, [User]); // Depend on User to re-run this effect when User changes
    */
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}
