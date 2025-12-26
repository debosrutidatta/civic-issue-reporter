var map = L.map('map').setView([12.9716, 77.5946], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var marker = L.marker([12.9716, 77.5946]).addTo(map);

marker.bindPopup("<b>Hello Team!</b><br>I am a test marker.").openPopup();
