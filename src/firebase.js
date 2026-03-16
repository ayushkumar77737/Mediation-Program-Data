import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPxo6utUZ24BsheDqXV-fthOHEXdS_mis",
  authDomain: "mediation-program-data.firebaseapp.com",
  projectId: "mediation-program-data",
  storageBucket: "mediation-program-data.firebasestorage.app",
  messagingSenderId: "947174498295",
  appId: "1:947174498295:web:2a861f8c2e579f36fe18f2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);