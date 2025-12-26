// firebase/issues-service.js

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

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
