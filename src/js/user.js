import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { firebaseConfig } from './config.js';
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let punoIme = ""; 
      let godine = 0;
      let score = 0;
      if (userSnap.exists()) {
        const data = userSnap.data();
        godine = data.godine;
        score = data.score;
        punoIme = `${data.first} ${data.last}`;
      }

      const infoEl = document.getElementById("user-info");
      infoEl.innerHTML = 
            `Ime i prezime: ${punoIme} || ` +
            `Godine: ${godine} || ` +
            `Username: ${user.displayName} || ` +
            `Email: ${user.email} || ` +
            `Rezultat testa: ${score}`;

    } catch (error) {
      console.error("Greška u dohvatu podataka: ", error);
    }

  }
});
