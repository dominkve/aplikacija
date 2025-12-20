// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// Add Firebase products that you want to use
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

// Initialize auth providers
const google = new GoogleAuthProvider();

const db = getFirestore(app);
console.log("Firestore initialized:", db.app.options.projectId);


// A list of all methods
const methodClass = {
    email: {
        signin: "email-signin-container",
        signup: "email-signup-container",
    },
    google: {
        signin: null,
    }
}

// Attaches an event listener to all buttons
let method = null;
document.querySelectorAll('.method-btn').forEach(button => {
    button.addEventListener('click', function() {
        method = this.getAttribute('data-method');
        
        // console.log("Selected method:", method);
        displayMethod(method, "signin");
    });
});

function displayMethod(method, action) {
    // hides available methods
    document.querySelector('.methods-container').classList.add('hidden');;

    // hides any previous open forms
    document.querySelectorAll(".method-form-container").forEach(container => {
        container.classList.add('hidden');
    });

    if (method == "google") {
        signInWithPopup(auth, google)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    } else {
        // shows selected method container
        document.getElementById(methodClass[method][action]).classList.remove('hidden');
    }
}

document.getElementById('back-btn').addEventListener('click', function() {
    event.preventDefault();

    window.location.reload();
});

document.getElementById('signup-btn').addEventListener('click', function() {
    event.preventDefault();

    displayMethod(method, "signup");
});

document.getElementById('signin-btn').addEventListener('click', function() {
    event.preventDefault();

    displayMethod(method, "signin");
});


let signupListener = function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;
  
    signUp(email, password); // Call the signUp function with email and password
};

document.getElementById('signup-form').addEventListener('submit', signupListener);

function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("User created:", user);
        
        // get the users username
        document.getElementById('email-password').classList.add('hidden');
        document.getElementById('signin-btn').classList.add('hidden');
        document.getElementById('names-container').classList.remove('hidden');

        document.getElementById('signup-form').removeEventListener('submit', signupListener);

        document.getElementById('signup-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            console.log("Username entered:", username);
            updateProfile(auth.currentUser, {
                displayName: username,
            }).then(() => {
                console.log("Username set to: ", auth.currentUser.displayName);
            }).catch((error) => {
                console.error("Error updating profile:", error);
            });

            let name = document.getElementById('name').value;
            let surname = document.getElementById('surname').value;

            console.log("Name:", name, "Surname:", surname);

            console.log("User UID:", user.uid);
            const strinf = String(user.uid);
            const userRef = doc(db, "users", strinf);

            // Add user details to Firestore
            setDoc(userRef, {
                first: name,
                last: surname,
            })
            .then((userRef) => {
                console.log("Document written with ID: ", user.uid);
                window.location.assign("main.html");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        
        // ...
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error code:", errorCode, "Error message:", errorMessage);
    // ..
    });
};

document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;
  
    signIn(email, password); // Call the signUp function with email and password
});

function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User signed in:", user);
      window.location.assign("main.html");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error code:", errorCode, "Error message:", errorMessage);
    });
};