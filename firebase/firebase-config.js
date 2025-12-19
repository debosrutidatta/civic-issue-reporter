import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAK3MdF8MKCClWra5sK9bxAbIz5p82igQo",
    authDomain: "ai-civic-issue-reporter-2.firebaseapp.com",
    projectId: "ai-civic-issue-reporter-2",
    storageBucket: "ai-civic-issue-reporter-2.firebasestorage.app",
    messagingSenderId: "730468321462",
    appId: "1:730468321462:web:4532b50322c7556bf4fe17"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save issue
export async function saveIssue(issueData) {
    await addDoc(collection(db, "issues"), {
        ...issueData,
        timestamp: new Date().toISOString(),
        status: "pending"
    });
}

// Read issues
export async function readIssues() {
    const snapshot = await getDocs(collection(db, "issues"));
    snapshot.forEach(doc => {
        console.log(doc.id, doc.data());
    });
}
