// map-logic.js

// 1. IMPORT SERVICE (Member 2's Database)
import { saveIssue } from "./firebase/issues-service.js";
// import { analyzeDescription } from "./ai-service.js"; // (Uncomment later when Member 3 is ready)

console.log("🚀 Map Logic Loaded. UI Ready.");

window.onload = function () {
    // Check if Leaflet map exists (Created by map.js)
    if (typeof map !== "undefined") {
        let currentMarker = null;

        // ============================================================
        // PART A: MAP INTERACTION (Clicking the map)
        // ============================================================
        map.on("click", function (e) {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);

            // 1. Update Hidden Inputs & Display Text
            document.getElementById(
                "latlng-display"
            ).innerText = `${lat}, ${lng}`;
            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lng;

            // 2. Visual Feedback (Green Border to show selection is done)
            const displayBox = document.getElementById("latlng-display");
            displayBox.style.borderColor = "#2ecc71";
            displayBox.style.color = "#27ae60";
            displayBox.style.backgroundColor = "#eafaf1";

            // 3. Move the Pin on the Map
            if (currentMarker) map.removeLayer(currentMarker);
            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup("<b>Selected Location</b><br>Issue is here.")
                .openPopup();

            // Clear any old error messages
            document.getElementById("status-msg").innerText = "";
        });

        // ============================================================
        // PART B: SUBMIT BUTTON LOGIC
        // ============================================================
        const submitBtn = document.getElementById("submitBtn");
        const statusMsg = document.getElementById("status-msg");

        submitBtn.addEventListener("click", async function () {
            // 1. Get Data from Form
            const lat = document.getElementById("lat").value;
            const lng = document.getElementById("lng").value;
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;

            // 2. Reset Status Message
            statusMsg.innerText = "";
            statusMsg.style.color = "#333";

            // 3. VALIDATION (The "Polite" Way - No Alerts)
            if (!lat || !lng) {
                statusMsg.innerText = "📍 Please select a location on the map!";
                statusMsg.style.color = "#e74c3c"; // Red
                shakeButton(); // Trigger animation
                return;
            }

            if (!category) {
                statusMsg.innerText = "⚠️ Please select an Issue Category.";
                statusMsg.style.color = "#e74c3c";
                shakeButton();
                return;
            }

            if (description.trim().length < 5) {
                statusMsg.innerText =
                    "📝 Please provide a description (min 5 chars).";
                statusMsg.style.color = "#e74c3c";
                document.getElementById("description").focus(); // Focus cursor
                shakeButton();
                return;
            }

            // 4. UI: Show Spinner & Disable Button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="loader"></div> Processing...';
            submitBtn.style.backgroundColor = "#95a5a6"; // Gray

            // 5. Prepare Data Package for Database
            const issueData = {
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                category: category,
                user_description: description,

                // 🔴 Placeholder for AI (Member 3 will add this later)
                ai_analysis: "Pending (Waiting for AI)",

                status: "pending",
                timestamp: new Date().toISOString(),
            };

            try {
                // 6. SEND TO FIREBASE
                const docId = await saveIssue(issueData);

                // ========================================================
                // ✅ SUCCESS! SWAP THE UI
                // ========================================================
                console.log("✅ Report Saved! ID:", docId);

                // Hide Form -> Show Success Card
                document.getElementById("form-container").style.display =
                    "none";
                document.getElementById("success-container").style.display =
                    "block";

                // Show the Tracking ID
                document.getElementById("track-id").innerText = docId;
            } catch (error) {
                console.error("Error saving:", error);

                // Error State
                statusMsg.innerText = "❌ Connection Failed. Check Console.";
                statusMsg.style.color = "#e74c3c";

                // Reset Button
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Try Again ❌";
                submitBtn.style.backgroundColor = "#e74c3c";
            }
        });

        // ============================================================
        // PART C: "SUBMIT ANOTHER" BUTTON LOGIC
        // ============================================================
        const resetBtn = document.getElementById("resetBtn");

        resetBtn.addEventListener("click", function () {
            // 1. Clear Inputs
            document.getElementById("description").value = "";
            document.getElementById("category").value = "";
            document.getElementById("latlng-display").innerText =
                "No location selected";
            document.getElementById("lat").value = "";
            document.getElementById("lng").value = "";
            document.getElementById("status-msg").innerText = "";

            // 2. Remove Map Pin
            if (currentMarker) map.removeLayer(currentMarker);
            currentMarker = null;

            // 3. Reset Styling
            document.getElementById("latlng-display").style.borderColor =
                "#bdc3c7";
            document.getElementById("latlng-display").style.color = "#7f8c8d";
            document.getElementById("latlng-display").style.backgroundColor =
                "#f8f9fa";

            // 4. Reset Submit Button
            const submitBtn = document.getElementById("submitBtn");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "🚀 Submit Report";
            submitBtn.style.backgroundColor = "#e74c3c"; // Red

            // 5. Swap UI Back (Show Form, Hide Success)
            document.getElementById("success-container").style.display = "none";
            document.getElementById("form-container").style.display = "block";
        });

        // Helper function for the wiggle animation
        function shakeButton() {
            const btn = document.getElementById("submitBtn");
            btn.classList.add("shake");
            setTimeout(() => btn.classList.remove("shake"), 500);
        }
    } else {
        console.error("Leaflet Map not found. Make sure map.js is loaded!");
    }
};
