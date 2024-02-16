import { createContext, useContext, useEffect, useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";

type AuthContextValue = {
    CreateUser: (email: string, password: string) => Promise<UserCredential>;
    SignIn: (email: string, password: string) => Promise<UserCredential>;
    User: User | null;
    SignOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const CreateUser = async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    }
    const SignIn = async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }
    const SignOut = async () => {
        return await auth.signOut();
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((CurrUser) => {
            console.log("user", CurrUser);
            setUser(CurrUser);
        });
        return unsubscribe;
    }, []);
    const authContextValue: AuthContextValue = {
        CreateUser,
        SignIn,
        User: user,
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
