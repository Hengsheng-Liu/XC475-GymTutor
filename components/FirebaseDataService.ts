// Import necessary modules for Firestore operations
import { firestore } from '../firebaseConfig';
import { 
    where, 
    query, 
    collection, 
    addDoc,
    setDoc, 
    doc, 
    getDoc,
    getDocs, 
    updateDoc, 
    arrayUnion} from 'firebase/firestore';
import { useAuth } from "../Context/AuthContext";

// Update this and addUsers function when adding new fields
// Use updateUsers function to initialize new fields on all users.
// Define User interface
export interface IUser {
    uid: string;
    email: string;
    name: string;
    age: string;
    bio: string;
    sex: string;
    tags: string[];
    friends: string[];
    friendRequests: string[];
    rejectedRequests: string[];
    blockedUsers: string[];
    gym: string;
    checkInHistory: string[]; // Add proper type
    icon: string;
    achievements: string[]; // Add proper type
    gymExperience: string;
    currentlyMessaging: string[];
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

// Function to add a new user to Firestore
export async function addUser(
        uid: string, 
        email: string = "", 
        gym: string = "", 
        name: string = "", 
        age: string = "", 
        bio: string = "",
        sex: string = "", 
        tags: string[] = []): Promise<void> {
        
    const db = firestore;
    try {
        // Create new user
        await setDoc(doc(db, "Users", uid), { //Modify this when adding new fields
            uid: uid,
            email: email,
            name: name,
            age: age,
            sex: sex,
            tags: tags,
            bio: bio,
            friends: [],
            friendRequests: [],
            rejectedRequests: [],
            blockedUsers: [],
            gym: gym,
            checkInHistory: [],
            icon: "",
            achievements: [],
            gymExperience: "0",
            currentlyMessaging: []
        });
        console.log("Document written for user: ", uid);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
};

// Function to get Current user given their uid.
export async function getCurrUser(uid: string): Promise<IUser | null> {
    const {User} = useAuth();
    if (!User) return null;

    const currUser = await getUser(User.uid);
    return currUser;
}

// Define a function to fetch all users and update them with missing fields
export async function updateUsers(): Promise<void> {
    const db = firestore;
    const usersRef = collection(db, 'Users');

    try {
        // Fetch all users
        const querySnapshot = await getDocs(usersRef);


        // Iterate over each user document
        querySnapshot.forEach(async (doc) => {
            const userData = doc.data() as IUser;

            // Define an empty user object with all fields set to empty strings
            // Add fields to update
            const newUserFields: Partial<IUser> = {
                currentlyMessaging: []
            };

            // Update document if any field is missing
            if (Object.keys(newUserFields).length > 0) {
                await updateDoc(doc.ref, newUserFields);
            }
        });

        console.log('All users updated with missing fields successfully');
    } catch (error) {
        console.error('Error updating users with missing fields:', error);
        throw error;
    }
}

// Ways to randomize some things
export async function randomIt(): Promise<void> {
    // Create random values for fields. Uncomment when used
    const minAge = 18;
    const maxAge = 60;
    const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

    const minExp = 0;
    const maxExp = 10;
    const randomExp = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;

    const gyms = ['Gym A', 'Gym B', 'Gym C', 'Gym D', 'Gym E'];
    const randomGymIndex = Math.floor(Math.random() * gyms.length);
    const randomGym = gyms[randomGymIndex];

    function generateRandomSex(): 'male' | 'female' {
        // Generate a random number between 0 and 1
        const randomValue = Math.random();
        // If the random number is less than 0.5, return 'male', otherwise return 'female'
        return randomValue < 0.5 ? 'male' : 'female';
    }

    const randomSex: 'male' | 'female' = generateRandomSex();

    const maleNames: string[] = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Charles', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'George', 'Joshua', 'Kevin', 'Brian', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Gary', 'Nicholas', 'Eric', 'Stephen', 'Jacob', 'Larry', 'Frank', 'Jonathan', 'Scott', 'Justin', 'Brandon', 'Raymond', 'Gregory', 'Samuel', 'Benjamin', 'Patrick', 'Jack', 'Alexander'];
    const femaleNames: string[] = ['Mary', 'Jennifer', 'Linda', 'Patricia', 'Susan', 'Karen', 'Jessica', 'Nancy', 'Sarah', 'Emily', 'Megan', 'Ashley', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Heather', 'Nicole', 'Elizabeth', 'Laura', 'Michelle', 'Kimberly', 'Amy', 'Angela', 'Christine', 'Samantha', 'Donna', 'Tiffany', 'Carol', 'Cynthia', 'Patricia', 'Sharon', 'Margaret', 'Lisa', 'Rebecca', 'Kathleen', 'Andrea', 'Pamela', 'Anna', 'Marie', 'Debra', 'Emily', 'Kelly', 'Mary', 'Brenda', 'Kristen', 'Janet', 'Julie'];

    // Function to generate a random name based on gender
    function generateRandomName(gender: 'male' | 'female'): string {
        const names = gender === 'male' ? maleNames : femaleNames;
        const randomIndex = Math.floor(Math.random() * names.length);
        return names[randomIndex];
    }

    // Example usage
    const randomName: string = generateRandomName(randomSex);
}

// Attempt to do it automatically. Didn't work and gave up
// Define a function to fetch all users and update them with missing fields
// export async function updateUsers(): Promise<void> {
//     const db = firestore;
//     const usersRef = collection(db, 'Users');

//     try {
//         // Fetch all users
//         const querySnapshot = await getDocs(usersRef);

//         // Iterate over each user document
//         querySnapshot.forEach(async (doc) => {
//             const userData = doc.data() as IUser;

//             // Define an empty user object with all fields set to empty strings
//             const emptyUser: Partial<IUser> = {
//                 uid: '',
//                 email: '',
//                 gym: '',
//                 name: '',
//                 age: '',
//                 bio: '',
//                 sex: '',
//                 tags: [],
//                 friends: [],
//                 friendRequests: [],
//                 checkInHistory: [],
//                 icon: "",
//                 achievements: [],
//                 gymExperience: ""
//             };

//             // Update user document with missing fields using emptyUser
//             const updateData: Partial<IUser> = {};
//             Object.keys(emptyUser).forEach((field) => {
//                 const key = field as keyof IUser; // Type assertion to keyof IUser
//                 if (!userData.hasOwnProperty(key)) {
//                     updateData[key] = emptyUser[key];
//                 }
//             });

//             // Update document if any field is missing
//             if (Object.keys(updateData).length > 0) {
//                 await updateDoc(doc.ref, updateData);
//             }
//         });

//         console.log('All users updated with missing fields successfully');
//     } catch (error) {
//         console.error('Error updating users with missing fields:', error);
//         throw error;
//     }
// }





