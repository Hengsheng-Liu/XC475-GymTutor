import { createContext, useContext, useEffect, useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {IUser, getUser} from "../components/FirebaseUserFunctions"
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

type AuthContextValue = {
    CreateUser: (email: string, password: string) => Promise<UserCredential>;
    SignIn: (email: string, password: string) => Promise<UserCredential>;
    User: User | null;
    currUser: IUser | null;
    updateCurrUser: () => void;
    SignOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currUser, setCurrUser] = useState<IUser | null>(null);

    const CreateUser = async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const SignIn = async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const SignOut = async () => {
        return await auth.signOut();
    };

    const updateCurrUser = async () => {
        if (user) {
            const userData = await getUser(user.uid);
            console.log("User Updated");
            setCurrUser(userData);
        } else {
            setCurrUser(null);
            console.log("No user data found!");
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            // console.log("user", CurrUser);
            setUser(currentUser);

            if (currentUser) {
                const userData = await getUser(currentUser.uid);
                console.log("User Updated");
                setCurrUser(userData);
            } else {
                setCurrUser(null);
                console.log("No user data found!");
            }
        });
        return unsubscribe;
    }, []);

    // useEffect(() => {    
    //     if (currUser) {
    //         const unsubscribe2 = onSnapshot(doc(firestore, "Users", currUser.uid), (doc) => {
    //             if (doc.exists()) {
    //                 const userData = doc.data() as IUser;
    //                 setCurrUser(userData);
    //             } else {
    //                 setCurrUser(null);
    //                 console.log("No user data found!");
    //             }
    //         });
    //         return unsubscribe2;
    //     }
    // }, []);

    const authContextValue: AuthContextValue = {
        CreateUser,
        SignIn,
        User: user,
        currUser: currUser,
        updateCurrUser,
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

