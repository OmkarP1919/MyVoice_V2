
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Use Gemini 3.0 Flash for robust multimodal analysis and JSON stability
// 'gemini-2.5-flash-preview' caused 404 errors, switching to confirmed available model.
const FAST_MODEL = 'gemini-3-flash-preview'; 

// Use Gemini 3.0 Pro for complex reasoning (Chatbot)
const CHAT_MODEL = 'gemini-3-pro-preview';

export const analyzeIssue = async (description: string, imageBase64?: string) => {
  try {
    const prompt = `Analyze this image for a civic issue reporting app.
    1. VALIDATION: Determine if this is a valid civic issue (pothole, garbage, broken street light, water leakage, fallen tree, illegal parking, broken infrastructure). 
       - If it is a selfie, a person, a pet, a blurry unusable photo, or an indoor private object, set "isCivicIssue" to false.
    2. CATEGORIZATION: If valid, strictly categorize into one of: 'Roads & Safety', 'Garbage & Sanitation', 'Water Supply', 'Electricity', 'Public Transport', 'Traffic', 'Parks & Trees', 'Other'.
    3. PRIORITY: Assess urgency based on hazard level (HIGH for immediate danger, MEDIUM for inconvenience, LOW for cosmetic).
    4. DEPARTMENT: Assign to 'Public Works', 'Municipal Corp', 'Traffic Police', 'Water Board', or 'Electric Board'.
    ${description ? `User description context: ${description}` : ''}`;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCivicIssue: { type: Type.BOOLEAN, description: "True if the image contains a valid civic issue." },
            rejectionReason: { type: Type.STRING, description: "Short reason if rejected." },
            category: { type: Type.STRING },
            department: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
            summary: { type: Type.STRING, description: "A concise title for the issue (max 5 words)" }
          },
          required: ["isCivicIssue", "category", "department", "priority", "summary"]
        }
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback: Assume valid if AI fails, let human moderator decide later
    return {
      isCivicIssue: true,
      category: "Uncategorized",
      department: "General Administration",
      priority: "MEDIUM",
      summary: description || "Issue reported"
    };
  }
};

export const checkDuplicateIssue = async (
  newImageBase64: string, 
  existingImageBase64: string
): Promise<{ isDuplicate: boolean; reason: string }> => {
  try {
    const prompt = `Compare these two images of civic issues. 
    Image 1 is a new report. Image 2 is an existing report.
    Do they appear to be the EXACT same specific issue (e.g. the exact same pothole, same garbage pile) from the same or different angle?
    Ignore generic similarities (like "both are potholes"). Look for specific visual identifiers.
    Return JSON.`;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: {
        parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: newImageBase64.split(',')[1] || newImageBase64 } },
            { inlineData: { mimeType: 'image/jpeg', data: existingImageBase64.split(',')[1] || existingImageBase64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isDuplicate: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isDuplicate", "reason"]
        }
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Duplicate check failed:", error);
    return { isDuplicate: false, reason: "Could not verify." };
  }
};

export const chatWithBot = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
    try {
        const chat = ai.chats.create({
            model: CHAT_MODEL,
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            })),
            config: {
                systemInstruction: "You are a helpful support assistant for the MyVoice civic issue platform. Help citizens report issues, understand rewards, and navigate the app. Keep answers concise.",
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat failed:", error);
        return "Sorry, I am having trouble connecting right now.";
    }
};
