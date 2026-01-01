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
    // --- TEMPORARY SIMULATION MODE ---
    // We create a "Fake Delay" to pretend we are saving to the cloud
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🔥 (Fake) Firebase responded: Success!");
    console.log("📦 Data that WOULD be saved:", issueData);

    return true; // Pretend it worked

    // --- REAL CODE (Commented out until Member 2 fixes Rules) ---
    /*
    await addDoc(collection(db, "issues"), {
        ...issueData,
        timestamp: new Date().toISOString(),
        status: "pending"
    });
    */

    console.log("🔥 Firebase responded!");
}

// Read issues
export async function readIssues() {
    const snapshot = await getDocs(collection(db, "issues"));
    snapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
    });
}
