
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5L_1Dbi_PwWzgXF-e00kMct47QD9tqW8",
  authDomain: "trainticketapp-79271.firebaseapp.com",
  projectId: "trainticketapp-79271",
  storageBucket: "trainticketapp-79271.appspot.com",
  messagingSenderId: "592349673475",
  appId: "1:592349673475:web:cc54935cc4824163a2b636"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;