// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPBunoNt_cCrCGzsgQyHZTs24E2XCxSW4",
  authDomain: "coffee-lady.firebaseapp.com",
  projectId: "coffee-lady",
  storageBucket: "coffee-lady.appspot.com",
  messagingSenderId: "818321820072",
  appId: "1:818321820072:web:54d1bb819f35f762e8f59d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
