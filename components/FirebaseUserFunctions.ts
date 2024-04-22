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
    arrayUnion
} from 'firebase/firestore';
import { useAuth } from "@/Context/AuthContext";
import { Geometry } from 'react-native-google-places-autocomplete';
import { GeoPoint } from 'firebase/firestore';
// Update this and addUsers function when adding new fields
// Use updateUsers function to initialize new fields on all users.
// Define User interface
import { Filters, defaultFilters } from '@/app/(tabs)/(HomePage)/Filter';
import Achievement from './ProfileComponents/Achievement';
import { CalendarUtils } from 'react-native-calendars';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

type Birthday = { day: number, month: number, year: number };
export interface Achievementprops {
    name: string;
    curr: number;
    max: number;
    achieved: boolean;
    description: string;
}
export interface DailyCheckIn {
    day: string;
    photo?: string;
}
export interface Achievements {
    Chest: Achievementprops[];
    Back: Achievementprops[];
    Legs: Achievementprops[];
    Core: Achievementprops[];
    Cardio: Achievementprops[];
    FullBody: Achievementprops[];
    Shoulder: Achievementprops[];
    CheckIn: Achievementprops[];
}

export const DefaultAchievement: Achievements = {
    Chest: [
        { name: "Chest Champion", curr: 0, max: 10, description: " Awarded for achieving 10 check-ins with the chest day, highlighting a focus on chest muscle development and strength.", achieved: false },
    ],
    Back: [
        { name: "Back Day Boss", curr: 0, max: 10, description: "Awarded for reaching 10 check-ins with the back day, indicating consistent effort towards back muscle strength and definition.", achieved: false },
    ],
    Legs: [
        { name: "Leg Day Legend", curr: 0, max: 10, description: "Awarded for completing 10 check-ins with the leg day, showcasing dedication to lower body strength and development.", achieved: false },
    ],
    Shoulder:[
        {name:"Shoulder Sculptor", curr: 0, max: 10, description:"Awarded for accumulating 10 check-ins with the shoulder day, demonstrating commitment to shoulder muscle growth and definition.",achieved:false}
    ],
    Cardio:[
        {name:"Cardio King", curr: 0, max: 10, description:"Awarded for achieving 10 check-ins with the cardio day, highlighting a focus on cardiovascular health and endurance.",achieved:false}
    ],
    Core:[
        {name:"Core Crusher", curr: 0, max: 10, description:"Awarded for reaching 10 check-ins with the core day, showcasing dedication to core muscle strength and definition.",achieved:false}
    ],
    FullBody:[
        {name:"Full Body Fiend", curr: 0, max: 10, description:"Awarded for completing 10 check-ins with the full body day, demonstrating commitment to overall body strength and development.",achieved:false}
    ],
    CheckIn: [
        { "name": "Check-In Champion", "curr": 0, "max": 15, "description": "Awarded for reaching 15 total check-ins.", "achieved": false },
        { "name": "Consistency Conqueror", "curr": 0, "max": 25, "description": "Awarded for making 25 check-ins in a single month.", "achieved": false },
        { "name": "Iron Dedication", "curr": 0, "max": 50, "description": "Awarded for hitting 50 consecutive check-ins without missing a day.", "achieved": false },
    ]
};

export type CurrentlyMessagingEntry = {
    userId: string;
    timeAsNumber: number;
};
type friendRequest = { friend: string, date: number, status: string } // Status can be "pending", "accepted", "rejected"

export interface IUser {
    uid: string;
    email: string;
    name: string;
    age: number;
    bio: string;
    status: string; // Shorter bio (one liner to show on preview)
    sex: string;
    tags: string[];
    friends: string[];
    friendRequests: friendRequest[];
    rejectedRequests: string[];
    blockedUsers: string[];
    gym: string;
    checkInHistory: DailyCheckIn[]; // Add proper type
    icon: string;
    Achievement: Achievements;
    gymExperience: string;
    currentlyMessaging: String[];
    gymId: string;
    filters: Filters;
    birthday: Birthday;
    display: string[];
    CurrentlyMessaging: CurrentlyMessagingEntry[]
    background: string;

}

export interface Gym {
    name: string;
    members: string[];
    Geometry: Geometry;
    bounding: GeoPoint[];
    Address: string;
}

// Function to retrieve users data from Firestore with a filter of gym or any other
export const getUsers = async (UID: string, gymId?: string, filters?: Filters, name?: string): Promise<IUser[]> => {
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
                if (memberIds.length === 0) {
                    return [];}
            }

        }

        // Query  users from their gym.
        // TODO: Maybe query only nearby users.
        let usersQuery = query(collection(db, 'Users'), where('uid', 'in', memberIds));

        // Apply additional filters if provided
        if (filters) {
            const { applyFilters, sex, age, gymExperience } = filters;
            // Check if filters should be applied in general
            if (applyFilters[0]) {
                // Filter by sex if specified
                if (applyFilters[1] && sex.length > 0) {
                    usersQuery = query(usersQuery, where("sex", "in", sex));
                }

                // Filter by age if specified
                if (applyFilters[2] && age.length === 2) {
                    usersQuery = query(usersQuery, where("age", ">=", age[0]), where("age", "<=", age[1]));
                }

                // Filter by gym experience if specified
                if (applyFilters[3] && gymExperience.length > 0) {
                    usersQuery = query(usersQuery, where("gymExperience", "in", gymExperience));
                };
            };
        };

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

        // Filter list of users by name if provided
        if (name && name !== "" && usersData.length > 0) {
            return filterUsersByName(usersData, name);
        };

        return usersData;

    } catch (error) {
        // Throw error for handling in the caller function
        console.error('Error querying users:', error);
        throw error;
    }
};

// Funtion to filter users given a full or part of a name
export const filterUsersByName = (usersData: IUser[], name: string): IUser[] => {
    // Convert the name to lowercase for case-insensitive matching
    const lowerCaseName = name.toLowerCase();

    // Filter users whose name matches the given name (case-insensitive)
    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(lowerCaseName)
    );

    return filteredUsers;
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
    status: string = "",
    gymExperience: string = "beginner",
    birthday: Birthday = { day: 1, month: 1, year: 2000 },
    filters: Filters = defaultFilters,
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
            status: status,
            friends: [],
            friendRequests: [],
            rejectedRequests: [],
            blockedUsers: [],
            gym: gym,
            gymId: gymId,
            checkInHistory: [],
            icon: "Icon/Default/Avatar.png",
            achievements: [],
            gymExperience: gymExperience,
            currentlyMessaging: [],
            filters: filters,
            birthday: birthday,
            Achievement: DefaultAchievement,
            display: []
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

// Developer function to add new fields to users or initialize them with random values
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

            function chooseGymExperience(): string {
                const experiences = ["beginner", "intermediate", "advanced"];
                const randomIndex = Math.floor(Math.random() * experiences.length);
                return experiences[randomIndex];
            }

            // Example usage
            const randomExperience = chooseGymExperience();

            function getRandomBirthday(): Birthday {
                const day = Math.floor(Math.random() * 28) + 1;
                const month = Math.floor(Math.random() * 12) + 1;
                const year = Math.floor(Math.random() * 30) + 1974;

                return { day, month, year };
            }
            const randomBirthday = getRandomBirthday();

            function calculateAge(birthday: Birthday): number {
                const today = new Date();
                const birthDate = new Date(birthday.year, birthday.month - 1, birthday.day);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                // If the current month is less than the birth month, or if it's the same month but the current day
                // is before the birth day, then subtract 1 from the age
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
            const age = calculateAge(randomBirthday);

            const fitnessStatusLines: string[] = [
                "Back Squat Enthusiast",
                "Protein Shake Connoisseur",
                "Deadlift Dynamo",
                "Yoga Warrior",
                "Kettlebell Junkie",
                "Swole Patrol Member",
                "Flexibility Fanatic",
                "Spin Class Addict",
                "Gym Rat Extraordinaire",
                "Burpee Boss",
                "Muscle-up Maverick",
                "CrossFit Crusader",
                "Weightlifting Wizard",
                "Plank Prodigy",
                "Fitness Freak",
                "Circuit Training Champ",
                "Running Renegade",
                "Powerlifting Powerhouse",
                "HIIT Hero"
            ];

            function getRandomStatus(): string {
                const randomIndex = Math.floor(Math.random() * fitnessStatusLines.length);
                return fitnessStatusLines[randomIndex];
            }

            const randomStatus: string = getRandomStatus();
            // Define an empty user object with all fields set to empty strings
            // Add fields to update
            const newUserFields: Partial<IUser> = {
                icon: "Icon/Default/Avatar.png",
            };

            // Update document if any field is missing
            if (Object.keys(newUserFields).length > 0) {
                await updateDoc(doc1.ref, newUserFields);
                console.log("Document updated for user: ", doc1.id);
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

// Developer function to remove a field from all users
export async function removeFieldFromUsers(): Promise<void> {
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
async function randomIt(): Promise<void> {
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
export const AddDate = async (uid: string, url:string|undefined) => {
    const Day = new Date();
    const Today = CalendarUtils.getCalendarDateString(Day);
    const newCheckIn: DailyCheckIn = {
        day: Today,
    };
    if (url){
        newCheckIn.photo = url;
    }

    try {
        const userRef = doc(firestore, "Users", uid);
        const userCheckHistory = (await getDoc(userRef)).data()?.checkInHistory;
        await updateDoc(userRef, {
            checkInHistory: [...userCheckHistory, newCheckIn],
        });
    } catch (error) {
        console.error("Error updating bio: ", error);
    }
};
export const getUserPicture = async (iconUrl: string, type: string): Promise<string | undefined> => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, iconUrl);
      const url = await getDownloadURL(storageRef);
      return url;  
    } catch (error) {
        console.error("Error getting user picture: ", error);
        switch(type){
            case "Avatar":
                return getUserPicture("/Default/Avatar.png", "Avatar");
            case "Background":
                return getUserPicture("/Default/Background.jpeg", "Background");
            default:
                return undefined; 
        }
    }
  };

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





