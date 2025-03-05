import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
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
const appleProvider = new OAuthProvider("apple.com");

// facebook sign in

export const handleFacebookSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("User signed in:", result.user);
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
    console.log("User Signed In:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

// apple sign in

export const handleAppleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    console.log("User Signed In:", result.user);
    return result.user;
  } catch (error) {
    console.error("Apple Sign-In Error:", error);
    return null;
  }
};
