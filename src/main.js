import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Use the modular functions
addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace", 
    born: 1815
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});