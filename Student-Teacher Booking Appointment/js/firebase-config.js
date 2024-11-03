// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBezXl9SRm4SWjh2CqNY9EPXAxHSyWcaa4",
    authDomain: "student-teacher-booking-e7d5c.firebaseapp.com",
    projectId: "student-teacher-booking-e7d5c",
    storageBucket: "student-teacher-booking-e7d5c.appspot.com",
    messagingSenderId: "853884684199",
    appId: "1:853884684199:web:9456d9d41cb68ad8b6d882",
    measurementId: "G-1R8FX7CG7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
