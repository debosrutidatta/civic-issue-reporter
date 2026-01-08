import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase-config.js";

export async function saveIssue(issueData) {
    console.log("Attempting to save to Firebase...");
    try {
        const docRef = await addDoc(collection(db, "issues"), issueData);
        console.log("Saved to Cloud! ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Database Error: ", e);
        throw e;
    }
}

// Fetches the 20 newest reports (For Community Feed & Admin Dashboard)
export async function getRecentIssues() {
    try {
        console.log("Fetching recent issues...");

        const q = query(
            collection(db, "issues"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(q);

        const issuesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`Found ${issuesList.length} issues.`);
        return issuesList;
    } catch (error) {
        console.error("Error fetching issues:", error);
        return []; // Returning empty list so that the app doesn't crash
    }
}