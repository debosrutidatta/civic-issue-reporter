import { db } from "./firebase/firebase-config.js";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.querySelector("#issues-table-body");

// Configuration for Real-time Protocol Listener
const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    tableBody.innerHTML = "";

    if (snapshot.empty) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 60px; color: #64748b;">
                    No incident reports currently recorded in the management console.
                </td>
            </tr>`;
        return;
    }

    snapshot.forEach((docSnap) => {
        const issue = docSnap.data();
        const id = docSnap.id;

        // Data Extraction based on Official JSON Contract
        const department = issue.ai_analysis?.department || "General";
        const category = issue.ai_analysis?.category || "Uncategorized";
        const urgency = issue.ai_analysis?.urgency || "Low";
        const description =
            issue.user_description ||
            "No specific details provided by citizen.";
        const sentiment = issue.ai_analysis?.sentiment || "Neutral";
        const status = issue.status || "pending";
        const imageUrl = issue.image_url || "";
        const lat = issue.location?.lat;
        const lng = issue.location?.lng;

        // Protocol Status Styling
        const statusColor =
            status === "pending"
                ? "bg-pending"
                : status === "in_progress"
                ? "bg-in_progress"
                : "bg-resolved";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" class="admin-img" style="width:52px; height:52px; object-fit:cover; border-radius:8px; border: 1px solid #e2e8f0; cursor: pointer;" onclick="window.open('${imageUrl}')">`
                        : '<span style="color:#cbd5e1; font-size:0.7rem;">NO PHOTO</span>'
                }
            </td>
            <td><span class="dept-name">${department}</span></td>
            <td><span style="font-size: 0.85rem; color: #475569;">${category}</span></td>
            <td>
                <div style="font-weight:500; color:#1e293b; margin-bottom:4px; max-width: 350px;">${description}</div>
                <div style="font-size:0.7rem; color:#94a3b8;">AI SENTIMENT: ${sentiment.toUpperCase()}</div>
            </td>
            <td><span class="badge ${urgency.toLowerCase()}">${urgency}</span></td>
            <td>
                <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}" target="_blank" class="map-btn">VIEW LOCATION</a>
            </td>
            <td>
                <div class="status-wrapper" style="display: flex; align-items: center; gap: 10px;">
                    <div class="status-indicator ${statusColor}" style="width: 10px; height: 10px; border-radius: 50%;"></div>
                    <select class="status-dropdown" data-id="${id}" style="border:none; background:transparent; font-weight:600; color:#334155; cursor:pointer; outline: none;">
                        <option value="pending" ${
                            status === "pending" ? "selected" : ""
                        }>Pending</option>
                        <option value="in_progress" ${
                            status === "in_progress" ? "selected" : ""
                        }>In Progress</option>
                        <option value="resolved" ${
                            status === "resolved" ? "selected" : ""
                        }>Resolved</option>
                    </select>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach Protocol Update Listeners
    attachDropdownListeners();
});

function attachDropdownListeners() {
    document.querySelectorAll(".status-dropdown").forEach((select) => {
        // Use a clean event to update Firestore
        select.onchange = async (e) => {
            const id = e.target.getAttribute("data-id");
            const newStatus = e.target.value;

            try {
                const issueRef = doc(db, "issues", id);
                await updateDoc(issueRef, { status: newStatus });
                console.log(
                    `%c Protocol Update: [${id}] set to ${newStatus}`,
                    "color: #10b981; font-weight: bold;"
                );
            } catch (error) {
                console.error(
                    "Critical System Error: Protocol Update Failed",
                    error
                );
                alert(
                    "Incident status could not be synchronized with the cloud."
                );
            }
        };
    });
}
