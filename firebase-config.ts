import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// NOTE: In a real deployment, these would come from process.env
// For this demo generation, placeholders are used.
const firebaseConfig = {
  apiKey: process.env.API_KEY || "AIzaSyD-PLACEHOLDER-API-KEY",
  authDomain: "banaz-cepte.firebaseapp.com",
  projectId: "banaz-cepte",
  storageBucket: "banaz-cepte.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XYZ123"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();