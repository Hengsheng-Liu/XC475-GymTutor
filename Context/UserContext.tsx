import { createContext, useContext, useEffect, useState } from "react";
import { User, UserCredential } from "firebase/auth";
import { IUser, getUser } from "../components/FirebaseUserFunctions";
import { useAuth } from "./AuthContext"; // Assuming you have access to the authenticated user from your AuthContext
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";


type UserContextValue = {
    currentUser: IUser | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { User: authUser } = useAuth(); // Assuming you have access to the authenticated user from your AuthContext
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        const fetchCurrentUser = async () => {
            if (authUser) {
                const userDocRef = doc(firestore, "users", authUser.uid);
                unsubscribe = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data() as IUser;
                        setCurrentUser(userData);
                    } else {
                        setCurrentUser(null);
                    }
                });
            }
        };

        fetchCurrentUser();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [authUser]);

    const userContextValue: UserContextValue = {
        currentUser,
        setCurrentUser
    };

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};