// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: 'AIzaSyCb4_-hE-4NY06goMAXXejTJ-cuFLQATPM',
  authDomain: 'tutoro-f2110.firebaseapp.com',
  projectId: 'tutoro-f2110',
  storageBucket: 'tutoro-f2110.firebasestorage.app',
  messagingSenderId: '612997313598',
  appId: '1:612997313598:web:909b747e76a38756a6cd6f',
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Firestore exportieren
export const db = getFirestore(app);
