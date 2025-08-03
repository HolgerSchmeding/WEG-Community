import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK-LdwrMXJqiq3BC13v2Uh6ii5YXSUhcM",
  authDomain: "silberbach-community-hub-t4zya.firebaseapp.com",
  projectId: "silberbach-community-hub-t4zya",
  storageBucket: "silberbach-community-hub-t4zya.appspot.com",
  messagingSenderId: "99490700746",
  appId: "1:99490700746:web:98843e537f65a72713c333"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };