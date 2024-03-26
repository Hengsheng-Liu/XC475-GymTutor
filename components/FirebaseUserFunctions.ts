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
import { Geometry } from 'react-native-google-places-autocomplete';
import { GeoPoint } from 'firebase/firestore';
// Update this and addUsers function when adding new fields
// Use updateUsers function to initialize new fields on all users.
// Define User interface

type filter = [string, string, any];

type birthday =  { day: 1, month: 3, year: 1990 } ;

export interface IUser {
    uid: string;
    email: string;
    name: string;
    age: number;
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
    gymExperience: number;
    currentlyMessaging: string[];
    gymId: string;
    filters: filter[];
    birthday: birthday;
}

export interface Gym{
    name: string;
    members: string[];
    Geometry: Geometry;
    bounding: GeoPoint[];
    Address: string;
}

// Function to retrieve users data from Firestore with a filter of gym or any other
export const getUsers = async (UID: string, gymId?: string, 
        filters?: { field: string, operator: string, value: any }[]): Promise<IUser[]> => {
    const db = firestore;

    try {
        // Get gym members if gym name is provided
        let memberIds: string[] = [];
        if (gymId) {
            const gymSnapshot = await getDoc(doc(db, 'Gyms', gymId));
            if (gymSnapshot.exists()) {
                const gymData = gymSnapshot.data();
                if (gymData && gymData.members) {
                    memberIds = gymData.members;
                }
            } 

        }

        // Query  users from their gym. If they don't have one, query all users
        // TODO: Maybe query only nearby users.
        let usersQuery = memberIds.length > 0 ? 
            query(collection(db, 'Users'), where('uid', 'in', memberIds)):
            query(collection(db, 'Users'));
        
        // Apply additional filters if provided
        if (filters && filters.length > 0) {
            for (const filter of filters) {
                if (filter.value == ""){
                    continue
                }
                if (filter.field == "gymExperience"){
                    continue
                    if (filter.operator == "<="){
                        continue
                    }
                }
                console.log("filter", filter.field, filter.operator, filter.value);
                usersQuery = query(usersQuery, where(filter.field, filter.operator as any, filter.value));
                
            }
        }

        // Get each user and save their data
        const querySnapshot = await getDocs(usersQuery);
        const usersData: IUser[] = [];

        // Save user data if it is not the current User
        querySnapshot.forEach(snap => {
            const userData = snap.data() as IUser;
            if (userData.uid !== UID) {
                usersData.push(userData);
            }
        });

        return usersData;

    } catch (error) {
        // Throw error for handling in the caller function
        console.error('Error querying users:', error);
        throw error;
    }
};

// Function to retrieve users data from Firestore with a filter of gym or any other
export const getUsers2 = async (UID: string, gym?: string, 
    filters?: { field: string, operator: string, value: any }[]): Promise<IUser[]> => {
    const db = firestore;
    
    // Query users from a specific gym, or all users if none is given
    let usersQuery = gym ? query(collection(db, 'Users'), where('gym', '==', gym)) : 
        collection(db, 'Users');

    // Query users based on given filters
    // TODO: Only query some of them
    console.log("HEEEEEY", filters);
    if (filters){
        console.log("CHECKED")
    }
    if (filters && filters.length > 0) {
        console.log("CHECKED");
        for (const filter of filters) {
            console.log("filter");
            console.log(filter.field, filter.operator, filter.value);
            usersQuery = query(usersQuery, where(filter.field, filter.operator as any, filter.value));
            console.log(usersQuery);
        }
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
        gymId: string = "",
        name: string = "", 
        age: number = 21, 
        bio: string = "",
        sex: string = "", 
        filters: filter[],
        birthday: birthday,
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
            gymId: gymId,
            checkInHistory: [],
            icon: "",
            achievements: [],
            gymExperience: 0,
            currentlyMessaging: [],
            filters: [],
            birthday: birthday
        });
        console.log("Document written for user: ", uid);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
};

// Function to get Current user given their uid.
export async function getCurrUser(uid: string): Promise<IUser> {
    const currUser = await getUser(uid);
    if (currUser === null) {
        throw new Error(`User with UID ${uid} not found`);
    }
    return currUser;
}


export async function updateUsers(): Promise<void> {
    const db = firestore;
    const usersRef = collection(db, 'Users');

    try {
        // Fetch all users
        const querySnapshot = await getDocs(usersRef);

        // Iterate over each user document
        for (const doc1 of querySnapshot.docs) {
            const userData = doc1.data() as IUser;
            // Create random values for fields. Uncomment when used
        const minAge = 18;
        const maxAge = 60;
        const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

        const minExp = 0;
        const maxExp = 10;
        const randomExp = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;

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

            const tags = ['cardio', 'weightlift', 'yoga', 'crossfit', 'running', 'swim', 'cycle', 'boxing', 'pilates'];
            
            function getRandomSubset<T>(array: T[], size: number): T[] {
                const shuffled = array.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, Math.min(size, array.length));
            }

            const userTags = getRandomSubset(tags, 3);
            
            // Define an empty user object with all fields set to empty strings
            // Add fields to update
            const newUserFields: Partial<IUser> = {
                birthday: { day: 1, month: 3, year: 1990 }, 
            };

            // Update document if any field is missing
            if (Object.keys(newUserFields).length > 0) {
                await updateDoc(doc1.ref, newUserFields);
            }
        }

        console.log('All users updated with missing fields successfully');
    } catch (error) {
        console.error('Error updating users with missing fields:', error);
        throw error;
    }
}

// Define a function to fetch all users and update them with missing fields
export async function updateUsersandGym(): Promise<void> {
    const db = firestore;
    const usersRef = collection(db, 'Users');
    const gymsRef = collection(db, "Gyms");

    try {
        // Fetch all users
        const querySnapshot = await getDocs(usersRef);
        const queryGymSnapshot = await getDocs(gymsRef);

        // Empty members from gym
        for (const doc of queryGymSnapshot.docs) {
            const newGymFields: Partial<Gym> = {
                members: []
            };

            // Update document if any field is missing
            if (Object.keys(newGymFields).length > 0) {
                await updateDoc(doc.ref, newGymFields);
            }
        }

        // Assuming you have a list of gyms with their IDs
        const gymsList: { gym: string, gymId: string }[] = [
            { gym: 'Back Bay Fit', gymId: 'ChIJ1R1krgR644kRWNHhZ7Xfbjg' },
            { gym: 'Boston University Fitness and Recreation Center', gymId: 'ChIJ4Whn6Oh544kRNbDs7r_lQ68' },
            { gym: 'Boston YMC Union', gymId: 'ChIJFawAyHd644kRV9wDs0Puy-s' },
            { gym: 'Invictus Boston - Fenway', gymId: 'ChIJSw7FxfV544kRedruTET0Sfc' },
            { gym: 'Esplanade Outdoor Gym', gymId: 'ChIJf5s4Svh544kRh8KQMWEZcYg' },
            // Add more gyms as needed
        ];

        // Iterate over each user document
        for (const doc1 of querySnapshot.docs) {
            const userData = doc1.data() as IUser;

            const randomIndex = Math.floor(Math.random() * gymsList.length);
            const randomGym = gymsList[randomIndex].gym;
            const randomGymId = gymsList[randomIndex].gymId;

            // Define an empty user object with all fields set to empty strings
            // Add fields to update
            const newUserFields: Partial<IUser> = {
                gym: randomGym,
                gymId: randomGymId
            };

            // Update document if any field is missing
            if (Object.keys(newUserFields).length > 0) {
                await updateDoc(doc1.ref, newUserFields);
            }
            
            const gymRef = doc(db, 'Gyms', randomGymId);
            const gymDocSnapshot = await getDoc(gymRef);

            if (gymDocSnapshot.exists()) {
                const gymData = gymDocSnapshot.data();
                if (gymData && Array.isArray(gymData.members)) {
                    const updatedMembers = [...gymData.members, doc1.data().uid];
                    await updateDoc(gymDocSnapshot.ref, { members: updatedMembers });
                }
            }
        }

        console.log('All users updated with missing fields successfully');
    } catch (error) {
        console.error('Error updating users with missing fields:', error);
        throw error;
    }
}

export async function  removeFieldFromUsers(): Promise<void> {
    const db = firestore;
    const usersRef = collection(db, 'Users');
    
    const snapshot = await getDocs(usersRef);
    console.log("remove in progress");
    // Iterate over each user document
    snapshot.forEach(async (doc) => {
      // Remove the specified field from the user document
      const userData = doc.data();
      delete userData.sentRequests;
      console.log(userData);

      // Update the document without the specified field
      // await updateDoc(doc.ref, userData)
      console.log(`Field removed from user document '${doc.id}'`);
    });
  };

// Ways to randomize some things
export async function randomIt(): Promise<void> {
    // Create random values for fields. Uncomment when used
    const minAge = 18;
    const maxAge = 60;
    const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

    const minExp = 0;
    const maxExp = 10;
    const randomExp = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;

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





