// ai-service.js

const API_KEY = "PASTE YOUR TEAM API KEY HERE";

/**
 * This function sends the user's issue description to Gemini AI
 * and returns a structured civic issue analysis.
 */
export async function analyzeDescription(userText) {
    console.log("🤖 Asking Gemini to analyze:", userText);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // ✅ FINAL, GENERIC & DATABASE-SAFE PROMPT
    const prompt = `
You are an AI assistant for a Civic Issue Reporting App.

Analyze the following user-reported civic issue:

"${userText}"

Return ONLY a valid JSON object with the exact structure below:

{
    "category": "Water Supply | Roads | Garbage | Electricity",
    "urgency": "High | Medium | Low",
    "sentiment": "Frustrated | Angry | Neutral | Calm",
    "department": "Water Authority | Municipal Corporation | Electricity Board"
}

Rules:
1. Category MUST be exactly one of: Water Supply, Roads, Garbage, Electricity.
2. Urgency must reflect seriousness: High, Medium, or Low.
3. Sentiment must match the user's tone.
4. Department mapping rules:
   - Water Supply → Water Authority
   - Roads or Garbage → Municipal Corporation
   - Electricity → Electricity Board
5. Output ONLY pure JSON.
6. Do NOT include markdown, explanations, or extra text.
`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        const data = await response.json();

        // 1️⃣ Extract AI response text
        const aiText = data.candidates[0].content.parts[0].text;

        // 2️⃣ Clean accidental markdown (safety net)
        const cleanJson = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // 3️⃣ Convert JSON string to JS object
        const result = JSON.parse(cleanJson);

        console.log("✅ AI Analysis Success:", result);
        return result;

    } catch (error) {
        console.error("❌ AI Error:", error);

        // 🛟 Safe fallback so app never crashes
        return {
            category: "Roads",
            urgency: "Medium",
            sentiment: "Neutral",
            department: "Municipal Corporation"
        };
    }
}