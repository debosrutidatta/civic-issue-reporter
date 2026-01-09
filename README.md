# FixMyCity

### AI-Powered Civic Engagement Platform
FixMyCity is a resilient web app that bridges the gap between citizens and local government. When you report an issue, our system uses Google Gemini 2.0 Flash to instantly read your description, pick the right department, and alert city officials so your neighborhood's problems get fixed faster.

**Website:** https://fixmycity-phi.vercel.app

---

## Demo Access

| Role | Email | Password |
| :--- | :--- | :--- |
| **Citizen Portal** | user@city.com | user123 |
| **Admin Dashboard** | admin@city.com | admin123 |

---

## Smart AI Integration
Our platform leverages Gemini 2.0 Flash to instantly analyze citizen reports, automatically classifying the department, urgency level, and user sentiment. This ensures that a "water main burst" is prioritized over a "leaky faucet," allowing for efficient resource allocation.

### JSON Data Contract
The frontend communicates with the AI and Firebase Firestore using a standardized schema:

```javascript
{
  // "id": (Firestore generates it automatically)

  "user_description": "Water leaking on 5th street", 

  "timestamp": "2026-01-09T10:00:00Z", // ISO-8601 Format

  "status": "pending", // Options: 'pending', 'resolved', 'rejected'

  "image_url": "", // URL to the photo

  "ai_analysis": {
    "category": "Water Supply", // Fixed: Water Supply, Roads, Garbage, Electricity
    "urgency": "High", // Fixed: Low, Medium, High
    "sentiment": "Frustrated", // Fixed: Frustrated, Angry, Neutral, Calm
    "department": "Water Authority" // Fixed: Water Authority, Municipal Corporation, Electricity Board
  },

  "location": {
    "lat": 12.971, // Number
    "lng": 77.594 // Number
  }
}
```
## Technical Stack
* **AI Engine:** Google Gemini 2.0 Flash API
* **Mapping:** Leaflet.js with OpenStreetMap
* **Database:** Firebase Firestore
* **Hosting:** Vercel
* **Frontend:** HTML5, CSS3, JavaScript
* **Design:** Professional UI powered by Google Fonts

## Key Features
* **Real-time Reporting:** Citizens can report issues with precise coordinates via Leaflet and upload image evidence.
* **Instant Data Synchronization:** Powered by Firebase Firestore, ensuring reports are stored instantly and appear on the Admin Dashboard without needing a page refresh.
* **Smart Triage:** Automated urgency assignment (High, Medium, or Low) and department routing driven by Gemini 2.0 Flash AI.
* **Admin Command Center:** A centralized management system for government officials to track, filter, and resolve public reports in real-time.

* ---

## Contributors | Team CivicForge

* **Manjima Bose** – Team Lead & Cloud Backend Strategy
* **Debosruti Datta** – Lead Developer & System Architecture
* **Sampreeti Datta** - AI Strategist
* **Kanyashree Paul** - Geospatial Interface Developer
