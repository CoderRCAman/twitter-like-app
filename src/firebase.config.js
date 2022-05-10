import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCHskm7rtbaT20R328t0orSqivnkNIiMhk",
  authDomain: "social-media-twitto.firebaseapp.com",
  projectId: "social-media-twitto",
  storageBucket: "social-media-twitto.appspot.com",
  messagingSenderId: "15739091551",
  appId: "1:15739091551:web:0cf06be03fb201bfed39ea",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app) ;

export { app, db, auth,storage };
