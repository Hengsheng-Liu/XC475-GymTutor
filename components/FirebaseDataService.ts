// Import necessary modules for Firestore operations
import { firestore } from '../firebaseConfig';
import { 
    where, 
    query, 
    collection, 
    addDoc, 
    doc, 
    getDoc,
    getDocs, 
    updateDoc, 
    arrayUnion} from 'firebase/firestore';


// Define User interface
export interface IUser {
    uid: string;
    email: string;
    name: string;
    friends: string[];
    Gym: string;
    CheckInHistory: any[]; // Add proper type
    icon: string;
    Achievement: any[]; // Add proper type
    GymExperience: string;
}

// Function to retrieve users data from Firestore with a filter of gym or any other
export const getUsers = async (UID: string, gym?: string, 
    filters?: [string, string, any][]): Promise<IUser[]> => {
    const db = firestore;

    // Query users from a specific gym, or all users if none is given
    let usersQuery = gym ? query(collection(db, 'Users'), where('Gym', '==', gym)) : 
        collection(db, 'Users');

    // Query users based on given filters
    // TODO: Only query some of them
    if (filters && filters.length > 0) {
        filters.forEach(([filterName, symbol, value]) => {
            usersQuery = query(usersQuery, where(filterName, symbol as any, value));
        });
    }

    // Get each user and save their data
    try {
        const querySnapshot = await getDocs(usersQuery);
        const usersData: IUser[] = []; 

        querySnapshot.forEach(snap => {
            const userData = snap.data() as IUser;
            if (userData.uid != UID){
                usersData.push(userData);
            };
        });

        return usersData;
    } catch (error) {
        // Throw error for handling in the caller function
        console.error('Error querying users:', error);
        throw error; 
    }
};

// Function to retrieve a user given their UID
export const getUser = async (uid: string): Promise<IUser | null> => {
    try {
        const db = firestore;
        const userDocRef = doc(db, 'Users', uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data() as IUser;
            return userData;
        } else {
            console.error('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// Function to add friends
export async function addFriend(userUID: string, friendUID: string): Promise<void> {
    const db = firestore;
    const userRef = doc(db, 'Users', userUID);
    const friendRef = doc(db, 'Users', friendUID);

    // Append user's uid to each other in friends section
    try {
        await updateDoc(userRef, { friends: arrayUnion(friendUID) });
        await updateDoc(friendRef, { friends: arrayUnion(userUID) });
        console.log('Friend added successfully: ', friendUID, userUID);
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

// Function to add a new user to Firestore
export async function addUser(uid: string, email: string = "email.com", gym: string = "gym", name: string = "name"): Promise<void> {
    const db = firestore;
    await addDoc(collection(db, "Users"), {
        uid: uid,
        email: email,
        name: name,
        friends: [],
        Gym: gym,
        CheckInHistory: [],
        icon: "",
        Achievement: [],
        GymExperience: "0",
    });
}