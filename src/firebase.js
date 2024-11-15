import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { user_id } from './store';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  projectId:  import.meta.env.VITE_FIREBASE_ID,
  storageBucket:  import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_SENDER,
  appId: import.meta.env.VITE_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
