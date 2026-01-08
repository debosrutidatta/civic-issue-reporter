import { saveIssue } from "./firebase/issues-service.js";
import { analyzeDescription } from "./ai-service.js";

console.log("🚀 Map Controller Loaded. Waiting for interaction...");

let map;
let currentMarker = null;

// Wait for HTML to load before running logic
window.onload = function () {
    initMap();
    setupEventListeners();
};

function initMap() {
    map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
    }).addTo(map);

    //  auto-detect user location
    if ("geolocation" in navigator) {
        console.log("🛰️ Attempting to find user...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.flyTo([userLat, userLng], 15, {
                    animate: true,
                    duration: 1.5,
                });

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

    map.on("click", function (e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        document.getElementById("latlng-display").innerText = `${lat}, ${lng}`;
        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        const displayBox = document.getElementById("latlng-display");
        displayBox.style.borderColor = "#2ecc71";
        displayBox.style.color = "#27ae60";
        displayBox.style.backgroundColor = "#eafaf1";

        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("<b>Selected Location</b><br>Issue is here.")
            .openPopup();

        // Clear any old error messages
        statusMsg.innerText = "";
    });

    submitBtn.addEventListener("click", async function () {
        // 1. Get Data from Form
        const lat = document.getElementById("lat").value;
        const lng = document.getElementById("lng").value;
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;

        // Reset Status Message
        statusMsg.innerText = "";
        statusMsg.style.color = "#333";

        // 2. validation
        if (!lat || !lng) {
            statusMsg.innerText = "📍 Please select a location on the map!";
            statusMsg.style.color = "#e74c3c";
            shakeButton();
            return;
        }

        if (!category) {
            statusMsg.innerText = "⚠️ Please select an Issue Category.";
            statusMsg.style.color = "#e74c3c";
            document.getElementById("category").focus();
            shakeButton();
            return;
        }

        if (description.trim().length < 5) {
            statusMsg.innerText =
                "📝 Please provide a description (min 5 chars).";
            statusMsg.style.color = "#e74c3c";
            document.getElementById("description").focus();
            shakeButton();
            return;
        }

        // 3. UI: Show Spinner & Disable Button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader"></div> Processing Report...';
        submitBtn.style.backgroundColor = "#95a5a6";

        // 4. THE core logic (AI + database)
        try {
            const fileInput = document.getElementById("imageFile");
            const file = fileInput.files[0];
            let imageUrl = "";

            // If a photo was selected, upload it first
            if (file) {
                submitBtn.innerHTML =
                    '<div class="loader"></div> Uploading Image...';
                imageUrl = await uploadToImgBB(file);
            }

            // Call your Gemini AI / Fallback Analysis
            const aiResults = await analyzeDescription(description);

            // Prepare Data Package (Matching with JSON Contract)
            const issueData = {
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                user_description: description,
                image_url: imageUrl,
                ai_analysis: aiResults,
                status: "pending",
                timestamp: new Date().toISOString(),
            };

            // Save to Firebase
            const docId = await saveIssue(issueData);

            console.log("✅ Report Saved! ID:", docId);

            document.getElementById("form-container").style.display = "none";
            document.getElementById("success-container").style.display =
                "block";
            document.getElementById("track-id").innerText = docId;
        } catch (error) {
            console.error("Critical Error:", error);

            // Error state UI
            statusMsg.innerText = "❌ Submission Failed. Please try again.";
            statusMsg.style.color = "#e74c3c";

            // Reset Button so user can retry
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Try Again 🚀";
            submitBtn.style.backgroundColor = "#e74c3c";
        }
    });

    
    // Submit another button logic
    resetBtn.addEventListener("click", function () {
        // Clear Inputs
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
        document.getElementById("latlng-display").innerText =
            "No location selected";
        document.getElementById("lat").value = "";
        document.getElementById("lng").value = "";
        document.getElementById("status-msg").innerText = "";

        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = null;

        const displayBox = document.getElementById("latlng-display");
        displayBox.style.borderColor = "#bdc3c7";
        displayBox.style.color = "#7f8c8d";
        displayBox.style.backgroundColor = "#f8f9fa";

        submitBtn.disabled = false;
        submitBtn.innerHTML = "🚀 Submit Report";
        submitBtn.style.backgroundColor = "#e74c3c";

        // Swap UI back (Show form, hide success)
        document.getElementById("success-container").style.display = "none";
        document.getElementById("form-container").style.display = "block";
    });

    function shakeButton() {
        const btn = document.getElementById("submitBtn");
        btn.classList.add("shake");
        setTimeout(() => btn.classList.remove("shake"), 500);
    }
}

// Function to upload image to ImgBB
async function uploadToImgBB(file) {
    const apiKey = "9b2e4d6a87268310de101af26d418644"; 
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
}