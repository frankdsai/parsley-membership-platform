import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtJuEHg557z9fgryFSuYMeQ8rKinYXEK4",
  authDomain: "parsley-membership-platform.firebaseapp.com",
  projectId: "parsley-membership-platform",
  storageBucket: "parsley-membership-platform.firebasestorage.app",
  messagingSenderId: "943856613574",
  appId: "1:943856613574:web:60878b73636874cf82bf67"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;