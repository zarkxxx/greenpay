import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBnEhuV0yJlMMvSOKwPXp7U6MhCNeFlkc0",
  authDomain: "greenpay-ba0ca.firebaseapp.com",
  projectId: "greenpay-ba0ca",
  storageBucket: "greenpay-ba0ca.firebasestorage.app",
  messagingSenderId: "540156469019",
  appId: "1:540156469019:web:2ce0915a01c0b27929bdbe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);