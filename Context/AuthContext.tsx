import { createContext, useContext, useEffect, useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {IUser, getUser} from "../components/FirebaseUserFunctions"
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Filters } from '@/app/(tabs)/(HomePage)/Filter';

type AuthContextValue = {
    CreateUser: (email: string, password: string) => Promise<UserCredential>;
    SignIn: (email: string, password: string) => Promise<UserCredential>;
    User: User | null;
    currUser: IUser | null;
    userFilters: Filters | undefined;
    updateFilters: (filters: Filters) => void;
    userGym: [string, string] | undefined;
    updateUserGym: (gymId: string, gymName: string) => void;
    SignOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currUser, setCurrUser] = useState<IUser | null>(null);
    const [userFilters, setUserFilters] = useState<Filters>();
    const [userGym, setUserGym] = useState<[string, string]>();

    const CreateUser = async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const SignIn = async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const SignOut = async () => {
        return await auth.signOut();
    };

    const updateFilters = (filters: Filters) => {
        setUserFilters(filters);
        console.log("Updated Filters!");
    }

    const updateUserGym = (gymId: string, gymName: string) => {
        setUserGym([gymId, gymName]);
        console.log("Updated Gym!");
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            // console.log("user", CurrUser);
            setUser(currentUser);

            if (currentUser) {
                const userData = await getUser(currentUser.uid);
                console.log("User Updated");
                setCurrUser(userData);
                if (userData){
                    setUserFilters(userData.filters);
                    setUserGym([userData.gymId, userData.gym]);
                }
            } else {
                setCurrUser(null);
                console.log("No user data found!");
            }
        });
        return unsubscribe;
    }, []);

    const authContextValue: AuthContextValue = {
        CreateUser,
        SignIn,
        User: user,
        currUser: currUser,
        userFilters,
        updateFilters,
        updateUserGym,
        userGym,
        SignOut
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => { 
    // useContext should be provided with a default value of null to avoid runtime errors
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
}

