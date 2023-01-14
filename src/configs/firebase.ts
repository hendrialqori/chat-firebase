// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTbk0cPAL9hcIx-3cH-3ey2P_Q0JA4RBQ",
  authDomain: "react-chat-f2c95.firebaseapp.com",
  projectId: "react-chat-f2c95",
  storageBucket: "react-chat-f2c95.appspot.com",
  messagingSenderId: "813112014015",
  appId: "1:813112014015:web:f4dea9e553de76fa03020a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const storage = getStorage()
const db = getFirestore()

export { app, auth, storage, db }