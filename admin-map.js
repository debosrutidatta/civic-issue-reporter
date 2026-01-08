import { db } from "./firebase/firebase-config.js";
import {
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize map (Start zoomed out to India view)
const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
    }
).addTo(map);

async function loadSmartMap() {
    try {
        console.log("📡 Connecting to Satellite...");
        const querySnapshot = await getDocs(collection(db, "issues"));

        let markersArray = [];
        let highUrgencyMarkers = [];

        querySnapshot.forEach((doc) => {
            const issue = doc.data();

            if (
                issue.location &&
                issue.location.lat &&
                issue.location.lng &&
                issue.location.lat !== 0
            ) {
                const jitterAmount = 0.0003;
                const finalLat =
                    issue.location.lat + (Math.random() - 0.5) * jitterAmount;
                const finalLng =
                    issue.location.lng + (Math.random() - 0.5) * jitterAmount;

                const urgency = issue.ai_analysis?.urgency || "Low";
                const category = issue.ai_analysis?.category || "Report";
                const dept = issue.ai_analysis?.department || "General";

                // Determine colors & classes based on urgency
                let pinColor = "#3b82f6"; // Blue
                let headerClass = "bg-low";

                if (urgency === "Medium") {
                    pinColor = "#f59e0b"; // Yellow
                    headerClass = "bg-medium";
                }
                if (urgency === "High") {
                    pinColor = "#ef4444"; // Red
                    headerClass = "bg-high";
                }

                const marker = L.circleMarker([finalLat, finalLng], {
                    radius: 10,
                    fillColor: pinColor,
                    color: "#fff", // White border
                    weight: 2,
                    fillOpacity: 0.9,
                }).addTo(map);

                marker.bindPopup(`
                    <div class="popup-card">
                        <div class="popup-header ${headerClass}">
                            ${urgency} Urgency
                        </div>
                        <div class="popup-body">
                            <h3>${category}</h3>
                            <p><b>Dept:</b> ${dept}</p>
                            <hr class="popup-divider">
                            <small class="popup-status">Status: ${issue.status}</small>
                        </div>
                    </div>
                `);

                markersArray.push(marker);

                if (urgency === "High") {
                    highUrgencyMarkers.push(marker);
                }
            }
        });

        highUrgencyMarkers.forEach((marker) => marker.bringToFront()); // This forces high urgency pins to draw over blue pins

        // Auto-zoom
        if (markersArray.length > 0) {
            console.log(`📍 Found ${markersArray.length} reports. Zooming in.`);
            const group = L.featureGroup(markersArray);
            map.fitBounds(group.getBounds(), {
                padding: [80, 80],
                maxZoom: 15,
            });
        } else {
            console.log("🤷 No reports found. Locating Admin...");
            locateAdmin();
        }
    } catch (error) {
        console.error("❌ Error loading map:", error);
    }
}

// Backup - find Admin location if database is empty
function locateAdmin() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Fly to user
            map.flyTo([lat, lng], 12);

            // Show "You are here" circle
            L.circle([lat, lng], {
                color: "#1e293b",
                fillColor: "#1e293b",
                fillOpacity: 0.1,
                radius: 1000,
            })
                .addTo(map)
                .bindPopup("<b>Admin HQ</b>")
                .openPopup();
        });
    }
}

loadSmartMap(); // Start the System