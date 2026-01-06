import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAK3MdF8MKCClWra5sK9bxAbIz5p82igQo",
    authDomain: "ai-civic-issue-reporter-2.firebaseapp.com",
    projectId: "ai-civic-issue-reporter-2",
    storageBucket: "ai-civic-issue-reporter-2.firebasestorage.app",
    messagingSenderId: "730468321462",
    appId: "1:730468321462:web:4532b50322c7556bf4fe17"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Button click
document.getElementById("submitBtn").addEventListener("click", async () => {
    const description = document.getElementById("description").value;
    const department = document.getElementById("department").value;
    const urgency = document.getElementById("urgency").value;

    if (!description || !department || !urgency) {
        alert("Please fill all fields");
        return;
    }

    try {
        await addDoc(collection(db, "issues"), {
            user_description: description,
            ai_analysis: {
                department: department,
                urgency: urgency
            },
            status: "pending",
            timestamp: new Date().toISOString()
        });

        alert("✅ Issue reported successfully!");
        document.getElementById("description").value = "";
        document.getElementById("department").value = "";
        document.getElementById("urgency").value = "";

    } catch (error) {
        console.error(error);
        alert("❌ Error saving issue");
    }
});
