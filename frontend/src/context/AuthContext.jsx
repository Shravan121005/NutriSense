import { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncWithBackend = async (firebaseUser) => {
        try {
            const res = await api.post("/auth/sync", {
                displayName: firebaseUser.displayName || "",
                photoURL: firebaseUser.photoURL || "",
            });
            setUserProfile(res.data.user);
        } catch (err) {
            console.error("Failed to sync user:", err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await syncWithBackend(firebaseUser);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const register = async (email, password, displayName) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        await syncWithBackend({ ...cred.user, displayName });
        return cred;
    };

    const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

    const logout = () => signOut(auth);

    const refreshProfile = async () => {
        if (user) {
            const res = await api.get("/users/profile");
            setUserProfile(res.data.user);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, userProfile, loading, login, register, loginWithGoogle, logout, refreshProfile }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
