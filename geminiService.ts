import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Initializes the AI client.
 * MANDATORY: Uses process.env.API_KEY as per system requirements.
 */
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    // This error indicates the key exists in settings but hasn't been deployed yet.
    throw new Error("API_KEY_NOT_DEPLOYED");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getClient();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude these specific quotes: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one high-impact, elite motivational quote for a top 1% performer (max 12 words).${excludeList}`,
      config: { temperature: 1.0 }
    });
    return response.text?.trim() || "Victory belongs to the most persevering.";
  } catch (error) {
    console.error("AI Quote Error:", error);
    return "Focus on the step in front of you.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = getClient();
    const contents = [
      ...chatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: `You are the ultimate elite performance coach. 
        Analyze the user's goal and break it down into high-impact, tactical tasks.
        
        Return JSON format ONLY:
        {
          "reply": "A concise, powerful, motivating response.",
          "suggestedTasks": [
            {
              "title": "Clear action-oriented task",
              "description": "Short elite detail",
              "priority": "HIGH",
              "timeSlot": "e.g. 09:00 AM"
            }
          ]
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH] },
                  timeSlot: { type: Type.STRING }
                },
                required: ["title", "priority"]
              }
            }
          },
          required: ["reply", "suggestedTasks"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    const msg = error.message === "API_KEY_NOT_DEPLOYED" 
      ? "CRITICAL: API_KEY found in Vercel settings but NOT deployed. Please click REDEPLOY in Vercel." 
      : "System offline. Check your API key status in Google AI Studio.";
    return { reply: msg, suggestedTasks: [] };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The operator finished ${completed}/${total} tasks. Provide one elite strategy for increasing output (max 8 words).`,
    });
    return response.text?.trim() || "Optimization is the key to high-velocity output.";
  } catch (error) {
    return "Execute your highest priority first.";
  }
};