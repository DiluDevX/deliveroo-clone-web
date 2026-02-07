import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAR0Dy13dDspMIxAJZw4VaDJyCtRcnHHqc",
  authDomain: "deliveroo-clone-433c7.firebaseapp.com",
  projectId: "deliveroo-clone-433c7",
  storageBucket: "deliveroo-clone-433c7.firebasestorage.app",
  messagingSenderId: "631737132345",
  appId: "1:631737132345:web:5ef52279b9edbd8e85f4e8",
  measurementId: "G-H2BYF3XSZR",
};

const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);

const facebookProvider = new FacebookAuthProvider();

// facebook sign in

export const handleFacebookSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Facebook Sign-In Error:", error);
    return null;
  }
};

// google sign in

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};
