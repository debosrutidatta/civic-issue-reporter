// ai-service.js

const API_KEY = "AIzaSyDTiXEO_8czub9691O2cSHFG2EZCMOG1zo";

/**
 * This function sends the user's issue description to Gemini AI
 * and returns a structured civic issue analysis.
 */
export async function analyzeDescription(userText) {
    console.log("🤖 Asking Gemini to analyze:", userText);

    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        API_KEY;

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
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        const data = await response.json();

        console.log("Full Error Details:", JSON.stringify(data, null, 2));

        // ADD SAFETY CHECK
        if (!data.candidates || data.candidates.length === 0) {
            console.error("Gemini Error:", data);
            throw new Error(
                "Gemini returned no candidates. Check API Key/URL."
            );
        }

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
        console.error("❌ AI API Failed, launching Smart Fallback:", error);

        // 🛟 SMART FALLBACK SYSTEM (The "Nuclear" Fix)
        const text = userText.toLowerCase();
        
        // 1. Set default values
        let result = {
            category: "Roads",
            urgency: "Medium",
            sentiment: "Neutral",
            department: "Municipal Corporation"
        };

        // 2. Keyword matching for Category & Department
        if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("sewage")) {
            result.category = "Water Supply";
            result.department = "Water Authority";
        } else if (text.includes("light") || text.includes("electricity") || text.includes("power") || text.includes("spark")) {
            result.category = "Electricity";
            result.department = "Electricity Board";
        } else if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("smell")) {
            result.category = "Garbage";
            result.department = "Municipal Corporation";
        }

        // 3. Keyword matching for Urgency
        if (text.includes("urgent") || text.includes("danger") || text.includes("flood") || text.includes("broken") || text.includes("immediate")) {
            result.urgency = "High";
        }

        // 4. Keyword matching for Sentiment
        if (text.includes("angry") || text.includes("bad") || text.includes("terrible") || text.includes("frustrated")) {
            result.sentiment = "Frustrated";
        }

        console.log("🛠️ Local Analysis Complete:", result);
        return result; 
    }
}