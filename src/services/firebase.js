// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TO DO: Replace with actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAGbKubYqydhVQAjgq4C5mEmR85MCSso1I",
  authDomain: "avid-ace-460612-j0.firebaseapp.com",
  projectId: "avid-ace-460612-j0",
  storageBucket: "avid-ace-460612-j0.firebasestorage.app",
  messagingSenderId: "95080649720",
  appId: "1:95080649720:web:86cd7cf7d312af21febc0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app); // Storage disabled

export default app;
