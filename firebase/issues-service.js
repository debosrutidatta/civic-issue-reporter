// firebase/issues-service.js

import {
    collection,
    addDoc,
    getDocs,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

// Save issue
export async function saveIssue(issueData) {
    console.log("🔥 Attempting to talk to Firebase...");

    try {
        // --- REAL CODE ACTIVATED ---
        // We create a new document in the "issues" collection
        const docRef = await addDoc(collection(db, "issues"), {
            ...issueData,
            // We force a new timestamp here to be accurate
            timestamp: new Date().toISOString(),
            // Ensure status is pending
            status: "pending",
        });

        console.log("✅ Saved to Cloud! ID: ", docRef.id);
        return docRef.id; // Return the ID so we can confirm it
    } catch (e) {
        console.error("❌ Database Error: ", e);
        throw e; // Pass error back to the UI to handle
    }
}

// Read issues(For the Admin Dashboard later)
export async function readIssues() {
    const snapshot = await getDocs(collection(db, "issues"));
    snapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
    });
}
