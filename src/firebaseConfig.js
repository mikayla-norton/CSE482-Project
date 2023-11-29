// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    getDoc,
    doc,
    updateDoc,
    DocumentReference,
    deleteDoc,
  } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyATKpMRstLUJGHMbHzIXWQrMSBQcFVvYjk",
    authDomain: "cse482-project-9fdbb.firebaseapp.com",
    projectId: "cse482-project-9fdbb",
    storageBucket: "cse482-project-9fdbb.appspot.com",
    messagingSenderId: "602204014186",
    appId: "1:602204014186:web:5ba396afee2a48e7232c13",
    measurementId: "G-MDLJXNQ0VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export {
    app,
    analytics,
    db
}