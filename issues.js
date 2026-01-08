// issues.js
import { getRecentIssues } from "./firebase/issues-service.js";

async function loadPage() {
    const listContainer = document.getElementById("issues-list");


    const issues = await getRecentIssues();

    // Clear Loading Text
    listContainer.innerHTML = "";

    // Handle Empty State
    if (issues.length === 0) {
        listContainer.innerHTML =
            "<p style='text-align:center; color: white;'>No issues yet. Be the first! 🏆</p>";
        return;
    }

    // Render Cards
    issues.forEach((issue) => {
        const category = issue.ai_analysis?.category || "General";
        const urgency = issue.ai_analysis?.urgency || "Low";
        const desc = issue.user_description || "No description provided";
        const status = issue.status || "Pending";
        const imageUrl = issue.image_url || ""; // Get the ImgBB link

        let dateStr = "Recently";
        if (issue.timestamp) {
            dateStr = new Date(issue.timestamp).toLocaleDateString();
        }

        const cardHTML = `
            <div class="issue-card border-${urgency}">
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" class="card-img" alt="Issue Photo">`
                        : ""
                }
                <div class="card-inner-padding">
                    <div class="card-top">
                        <span>${category}</span>
                        <span style="color: #333;">${urgency} Priority</span>
                    </div>
                    <h3 class="card-title">${desc}</h3>
                    <div class="card-bottom">
                        <span>Status: <b>${status.toUpperCase()}</b></span>
                        <span>📅 ${dateStr}</span>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHTML;
    });
}

loadPage();
