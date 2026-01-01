// map-logic.js

// 1. Import Member 2's Function
// (We use relative paths: ./firebase/...)
import { saveIssue } from "./firebase/issues-service.js";

console.log("Map Logic Loaded. Database connected.");

window.onload = function () {
    // Check if map exists from Member 4's file
    if (typeof map !== "undefined") {
        let currentMarker = null;

        // --- PART A: MAP CLICKS (Member 4 Integration) ---
        map.on("click", function (e) {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);

            // Update UI
            document.getElementById(
                "latlng-display"
            ).innerText = `${lat}, ${lng}`;
            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lng;

            // Visual feedback
            const displayBox = document.getElementById("latlng-display");
            displayBox.style.borderColor = "#2ecc71";
            displayBox.style.color = "#27ae60";

            // Marker Logic
            if (currentMarker) map.removeLayer(currentMarker);
            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup("<b>Selected Location</b><br>Report issue here.")
                .openPopup();
        });

        // --- PART B: FORM SUBMISSION (Member 2 Integration) ---
        const submitBtn = document.getElementById("submitBtn");

        submitBtn.addEventListener("click", async function () {
            // 1. Get Data from HTML
            const lat = document.getElementById("lat").value;
            const lng = document.getElementById("lng").value;
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;
            const statusMsg = document.getElementById("status-msg");

            // 2. Simple Validation
            if (!lat || !lng) {
                alert("Please click on the map to select a location first!");
                return;
            }
            if (description.trim() === "") {
                alert("Please describe the issue.");
                return;
            }

            // 3. Prepare Data Object
            const issueData = {
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                category: category,
                description: description,
                // Add AI analysis here later (Member 3's Job)
                aiAnalysis: "Pending",
            };

            // 4. Send to Firebase (Member 2's Code)
            statusMsg.innerText = "⏳ Saving to database...";
            statusMsg.style.color = "blue";
            submitBtn.disabled = true; // Prevent double clicking

            try {
                await saveIssue(issueData);

                // Success!
                statusMsg.innerText = "✅ Report Submitted Successfully!";
                statusMsg.style.color = "green";

                // Optional: Reset form
                document.getElementById("description").value = "";
                // Redirect home after 2 seconds?
                // setTimeout(() => window.location.href = 'index.html', 2000);
            } catch (error) {
                console.error("Error saving:", error);
                statusMsg.innerText = "❌ Error saving report. Check console.";
                statusMsg.style.color = "red";
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error(
            "Leaflet Map not found. Make sure map.js is loaded first!"
        );
    }
};
