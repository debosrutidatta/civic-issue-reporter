// firebase/firebase-config.js

// 1. We import the specific functions we need (Tree Shaking compatible)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Your Project Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAK3MdF8MKCClWra5sK9bxAbIz5p82igQo",
    authDomain: "ai-civic-issue-reporter-2.firebaseapp.com",
    projectId: "ai-civic-issue-reporter-2",
    storageBucket: "ai-civic-issue-reporter-2.firebasestorage.app",
    messagingSenderId: "730468321462",
    appId: "1:730468321462:web:4532b50322c7556bf4fe17"
};

// 3. Initialize the App
const app = initializeApp(firebaseConfig);

// 4. Initialize and EXPORT the Database so other files can use it
export const db = getFirestore(app);