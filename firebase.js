// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3um8ZZ3CGwIyWNVkoJEXa-mGiiCOcj20",
  authDomain: "blog-project-eb9a6.firebaseapp.com",
  projectId: "blog-project-eb9a6",
  storageBucket: "blog-project-eb9a6.appspot.com",
  messagingSenderId: "1059772417826",
  appId: "1:1059772417826:web:d57f463d6501cbbf70877b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage =getStorage(app);
export const db =getFirestore(app);