// firebase/issues-service.js
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase-config.js";

// --- 1. SAVE ISSUE (For Map Page) ---
export async function saveIssue(issueData) {
    console.log("Attempting to save to Firebase...");
    try {
        // Just save exactly what is in issueData
        const docRef = await addDoc(collection(db, "issues"), issueData);
        console.log("Saved to Cloud! ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Database Error: ", e);
        throw e;
    }
}

// --- 2. GET RECENT ISSUES (For Citizen Feed & Admin Dashboard) ---
// Fetches the 20 newest reports. Used by both issues.html and admin-list.html
export async function getRecentIssues() {
    try {
        console.log("Fetching recent issues...");

        // Query: Collection 'issues', Sort by 'timestamp' (Newest first), Limit 20
        const q = query(
            collection(db, "issues"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(q);

        // Convert snapshot to a clean array of objects
        const issuesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`Found ${issuesList.length} issues.`);
        return issuesList;
    } catch (error) {
        console.error("Error fetching issues:", error);
        return []; // Return empty list so the app doesn't crash
    }
}