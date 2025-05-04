import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "learnai-181bb.firebaseapp.com",
    projectId: "learnai-181bb",
    storageBucket: "learnai-181bb.appspot.com",
    messagingSenderId: "102371001093694315634",
    appId: "1:102371001093694315634:web:a1b2c3d4e5f6g7h8i9j0" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;