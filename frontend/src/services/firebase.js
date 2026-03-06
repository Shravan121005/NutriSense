import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";
import { firebaseConfig } from "../config/firebaseConfig";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Messaging may not be supported in all browsers
export const getFirebaseMessaging = async () => {
    const supported = await isSupported();
    if (supported) {
        return getMessaging(app);
    }
    return null;
};

export default app;
