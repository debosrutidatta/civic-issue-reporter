import { db } from "./firebase/firebase-config.js"; 
import { collection, onSnapshot, doc, updateDoc, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.querySelector("#issues-table tbody");

// ✅ Real-time listener: Updates instantly when a new report comes in
const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    tableBody.innerHTML = ""; 

    if (snapshot.empty) {
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center'>No reports found.</td></tr>";
        return;
    }

    snapshot.forEach((docSnap) => {
        const issue = docSnap.data();
        const id = docSnap.id;
        
        // Handle missing data gracefully
        const department = issue.ai_analysis?.department || "General"; 
        const category = issue.ai_analysis?.category || "Uncategorized";
        const urgency = issue.ai_analysis?.urgency || "Low";
        const description = issue.user_description || "No description";
        const status = issue.status || "pending";
        
        // Set colors for the dropdown based on current status
        let statusClass = "status-pending";
        if (status === "in_progress") statusClass = "status-progress";
        if (status === "resolved") statusClass = "status-resolved";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${department}</strong></td>
            <td>${category}</td>
            <td>${description}</td>
            <td><span class="badge ${urgency.toLowerCase()}">${urgency}</span></td>
            <td>
                <select class="status-dropdown ${statusClass}" data-id="${id}">
                    <option value="pending" ${status === 'pending' ? 'selected' : ''}>🔴 Pending</option>
                    <option value="in_progress" ${status === 'in_progress' ? 'selected' : ''}>🟡 In Progress</option>
                    <option value="resolved" ${status === 'resolved' ? 'selected' : ''}>🟢 Resolved</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Re-attach listeners so the dropdowns actually work
    document.querySelectorAll(".status-dropdown").forEach(select => {
        select.addEventListener("change", async (e) => {
            const id = e.target.getAttribute("data-id");
            const newStatus = e.target.value;
            try {
                const issueRef = doc(db, "issues", id);
                await updateDoc(issueRef, { status: newStatus });
                
                // Visual update immediately
                e.target.className = `status-dropdown status-${newStatus}`;
                console.log(`Updated to ${newStatus}`);
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to update status. Check console.");
            }
        });
    });
});
