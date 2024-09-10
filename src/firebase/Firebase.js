// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWb0ToIlIT7i-R0DnPk6Z-R1iVp36SIoo",
    authDomain: "fyp-practice-d9814.firebaseapp.com",
    projectId: "fyp-practice-d9814",
    storageBucket: "fyp-practice-d9814.appspot.com",
    messagingSenderId: "298704112410",
    appId: "1:298704112410:web:8219d36da7673e24577aa3",
    measurementId: "G-X9VHVJ27YY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
export { app, auth, db }