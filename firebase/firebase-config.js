// firebase/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAK3MdF8MKCClWra5sK9bxAbIz5p82igQo",
    authDomain: "ai-civic-issue-reporter-2.firebaseapp.com",
    projectId: "ai-civic-issue-reporter-2",
    storageBucket: "ai-civic-issue-reporter-2.firebasestorage.app",
    messagingSenderId: "730468321462",
    appId: "1:730468321462:web:4532b50322c7556bf4fe17"
};

const app = initializeApp(firebaseConfig);

// ✅ ONLY export db from config
export const db = getFirestore(app);

