import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

// Your same Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAfjGkYuKVHmES-plwEQANUu1wRYxHFsBw",
  authDomain: "aplikacija-21276.firebaseapp.com",
  projectId: "aplikacija-21276",
  storageBucket: "aplikacija-21276.firebasestorage.app",
  messagingSenderId: "268238860819",
  appId: "1:268238860819:web:da620228aa41aa64bf05e6",
  measurementId: "G-HMTTWPWD75"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Check auth state when main.html loads
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user);

    // Update UI or do whatever you need with the user data
    document.getElementById('user-info').textContent = user.email;
  } else {
    // User is signed out, redirect back to login
    console.log("No user signed in, redirecting to login");
    window.location.assign("auth.html"); // or your login page
  }
});