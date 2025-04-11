import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBHfbrY4GcdmGbayn_RUIn6Io2B6TnG-_Q",
  authDomain: "grocery-store-reactnext-yatish.firebaseapp.com",
  projectId: "grocery-store-reactnext-yatish",
  storageBucket: "grocery-store-reactnext-yatish.firebasestorage.app",
  messagingSenderId: "1092213852326",
  appId: "1:1092213852326:web:31a8b737d4712730b0cc67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export auth for authentication
export const db = getFirestore(app); // Export Firestore instance