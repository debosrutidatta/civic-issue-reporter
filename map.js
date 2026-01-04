// map.js
// THE MASTER MAP CONTROLLER
// Combines UI, Map Logic, and Database connections

// 1. IMPORT SERVICE (Member 2's Database)
import { saveIssue } from "./firebase/issues-service.js";
// import { analyzeDescription } from "./ai-service.js"; // (Uncomment later)

console.log("🚀 Map Controller Loaded. Waiting for interaction...");

// Global variables
let map;
let currentMarker = null;

// Wait for HTML to load before running logic
window.onload = function () {
    initMap();
    setupEventListeners();
};

function initMap() {
    // ============================================================
    // PART A: SMART MAP INITIALIZATION 🌍
    // ============================================================

    // Default: India view (in case location is denied)
    map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
    }).addTo(map);

    // 🚀 AUTO-DETECT USER LOCATION
    if ("geolocation" in navigator) {
        console.log("🛰️ Attempting to find user...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Fly to user
                map.flyTo([userLat, userLng], 15, {
                    animate: true,
                    duration: 1.5,
                });

                // "You are here" circle
                L.circle([userLat, userLng], {
                    color: "#3498db",
                    fillColor: "#3498db",
                    fillOpacity: 0.2,
                    radius: 200,
                }).addTo(map);
            },
            (error) => {
                console.warn(
                    "⚠️ Location access denied. Staying on default view."
                );
            }
        );
    }
}

function setupEventListeners() {
    // Define buttons clearly
    const submitBtn = document.getElementById("submitBtn");
    const resetBtn = document.getElementById("resetBtn");
    const statusMsg = document.getElementById("status-msg");

    // ============================================================
    // PART A: MAP INTERACTION (Clicking the map)
    // ============================================================
    map.on("click", function (e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        // Update  Hidden Inputs & Display Text
        document.getElementById("latlng-display").innerText = `${lat}, ${lng}`;
        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        // Visual Feedback (Green Border to show selection is done)
        const displayBox = document.getElementById("latlng-display");
        displayBox.style.borderColor = "#2ecc71";
        displayBox.style.color = "#27ae60";
        displayBox.style.backgroundColor = "#eafaf1";

        // Move the Pin on the Map
        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("<b>Selected Location</b><br>Issue is here.")
            .openPopup();

        // Clear any old error messages
        statusMsg.innerText = "";
    });

    // ============================================================
    // PART C: SUBMIT BUTTON LOGIC
    // ============================================================
    submitBtn.addEventListener("click", async function () {
        // Get Data from Form
        const lat = document.getElementById("lat").value;
        const lng = document.getElementById("lng").value;
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;

        // Reset Status Message
        statusMsg.innerText = "";
        statusMsg.style.color = "#333";

        // --- VALIDATION ---

        // 1. Location Check
        if (!lat || !lng) {
            statusMsg.innerText = "📍 Please select a location on the map!";
            statusMsg.style.color = "#e74c3c";
            shakeButton();
            return;
        }

        // 2. Category Check
        if (!category) {
            statusMsg.innerText = "⚠️ Please select an Issue Category.";
            statusMsg.style.color = "#e74c3c";
            document.getElementById("category").focus(); // Focus the dropdown
            shakeButton();
            return;
        }

        // 3. Description Check
        if (description.trim().length < 5) {
            statusMsg.innerText =
                "📝 Please provide a description (min 5 chars).";
            statusMsg.style.color = "#e74c3c";
            document.getElementById("description").focus(); // Focus the text area
            shakeButton();
            return;
        }

        // UI: Show Spinner & Disable Button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader"></div> Processing...';
        submitBtn.style.backgroundColor = "#95a5a6";

        // Prepare Data Package for Database
        const issueData = {
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            category: category,
            user_description: description,

            // Placeholder for AI (Member 3 will add this later)
            ai_analysis: "Pending",
            status: "pending",
            timestamp: new Date().toISOString(),
        };

        try {
            // Send to Firebase
            const docId = await saveIssue(issueData);

            //✅ SUCCESS! SWAP THE UI
            console.log("✅ Report Saved! ID:", docId);

            // Hide Form -> Show Success Card
            document.getElementById("form-container").style.display = "none";
            document.getElementById("success-container").style.display =
                "block";
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
    // PART D: SUBMIT ANOTHER BUTTON LOGIC
    // ============================================================
    resetBtn.addEventListener("click", function () {
        // Clear Inputs
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
        document.getElementById("latlng-display").innerText =
            "No location selected";
        document.getElementById("lat").value = "";
        document.getElementById("lng").value = "";
        document.getElementById("status-msg").innerText = "";

        // Remove Map Pin
        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = null;

        // Reset Styling
        const displayBox = document.getElementById("latlng-display");
        displayBox.style.borderColor = "#bdc3c7";
        displayBox.style.color = "#7f8c8d";
        displayBox.style.backgroundColor = "#f8f9fa";

        // Reset Submit Button
        submitBtn.disabled = false;
        submitBtn.innerHTML = "🚀 Submit Report";
        submitBtn.style.backgroundColor = "#e74c3c";

        // Swap UI Back (Show Form, Hide Success)
        document.getElementById("success-container").style.display = "none";
        document.getElementById("form-container").style.display = "block";
    });

    // Helper function for shake animation
    function shakeButton() {
        const btn = document.getElementById("submitBtn");
        btn.classList.add("shake");
        setTimeout(() => btn.classList.remove("shake"), 500);
    }
}
