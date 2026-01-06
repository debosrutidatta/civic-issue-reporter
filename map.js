// 1. ALL IMPORTS AT THE TOP
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyAK3MdF8MKCClWra5sK9bxAbIz5p82igQo",
    authDomain: "ai-civic-issue-reporter-2.firebaseapp.com",
    projectId: "ai-civic-issue-reporter-2",
    storageBucket: "ai-civic-issue-reporter-2.firebasestorage.app",
    messagingSenderId: "730468321462",
    appId: "1:730468321462:web:4532b50322c7556bf4fe17"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. MAP INITIALIZATION
var map = L.map('map').setView([12.9716, 77.5946], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let activeMarker = null;

// 4. MAP CLICK HANDLER
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);

    if (activeMarker) {
        activeMarker.setLatLng(e.latlng);
    } else {
        activeMarker = L.marker([lat, lng]).addTo(map);
    }
});

// 5. UTILITY FUNCTIONS (Out here so they can be reused)
function getDepartment(cat) {
    const deptMap = {
        "Water Supply": "BWSSB",
        "Electricity": "BESCOM",
        "Roads": "BBMP",
        "Garbage": "BBMP"
    };
    return deptMap[cat] || "General Authority";
}

async function uploadToImgBB(file) {
    const apiKey = "9b2e4d6a87268310de101af26d418644";
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
}

// 6. LOAD EXISTING ISSUES (Shows pins on map load)
async function loadExistingIssues() {
    const querySnapshot = await getDocs(collection(db, "issues"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
        marker.bindPopup(`
            <div style="width: 200px;">
                <img src="${data.image_url}" style="width:100%; border-radius:5px;">
                <p><b>Issue:</b> ${data.user_description}</p>
                <p><b>Dept:</b> ${data.ai_analysis.department}</p>
                <p><b>Status:</b> ${data.status}</p>
            </div>
        `);
    });
}
loadExistingIssues();

// 7. SUBMIT BUTTON HANDLER
document.getElementById('submitBtn').addEventListener('click', async () => {
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;
    const fileInput = document.getElementById("imageFile");
    const file = fileInput.files[0];

    if (!file || !lat || !lng) {
        alert("📍 Please click the map and select a photo!");
        return;
    }

    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
        const imageUrl = await uploadToImgBB(file);

        const issueData = {
            user_description: description,
            timestamp: new Date().toISOString(),
            status: "pending",
            image_url: imageUrl,
            ai_analysis: {
                category: category,
                urgency: "High",
                sentiment: "Frustrated",
                department: getDepartment(category) // Using our helper function
            },
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            }
        };

        const docRef = await addDoc(collection(db, "issues"), issueData);

        // UI SUCCESS STATE
        document.getElementById("form-container").style.display = "none";
        document.getElementById("success-container").style.display = "block";
        document.getElementById("track-id").innerText = docRef.id;

    } catch (err) {
        console.error(err);
        alert("❌ Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "Submit Issue";
    }
});