# civic-issue-reporter
An AI-powered civic engagement web app that auto-classifies reported public issues, urgency and location for rapid fixes in your city.

# website:

## Demo Access

**Citizen Portal**
* Email: user@city.com
* Password: user123

**Admin Dashboard**
* Email: admin@city.com
* Password: admin123

## AI Features

The system uses AI to automatically categorize citizen reports by department and assign urgency levels (High, Medium, or Low) based on the text descriptions provided in the report.

// JSON CONTRACT 

{
  // "id": (Do not send this. Firestore generates it automatically)

  "user_description": "Water leaking on 5th street", // CHANGED: Matches Member 2's backend name

  "timestamp": "2023-10-27T10:00:00Z", // Use: new Date().toISOString()

  "status": "pending", // (String) Options: 'pending', 'resolved', 'rejected'

  "image_url": "", // (String) URL to the photo. Leave empty "" for now.

  "ai_analysis": {
    "category": "Water Supply", // (String) Fixed: Water, Roads, Garbage, Electricity
    "urgency": "High", // (String) Fixed: Low, Medium, High
    "sentiment": "Frustrated", // (String) Optional but cool
    "department": "BWSSB" // (String) The authority name
  },

  "location": {
    "lat": 12.971, // (Number)
    "lng": 77.594 // (Number)
  }
}
