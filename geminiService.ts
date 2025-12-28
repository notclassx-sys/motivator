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
    // If you see this error, you MUST redeploy your project on Vercel after adding the key.
    throw new Error("API_KEY_NOT_FOUND_IN_ENV");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getClient();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one high-impact, elite motivational quote (max 12 words).${excludeList}`,
      config: { temperature: 1.0 }
    });
    return response.text?.trim() || "The world is won by those who show up.";
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
        systemInstruction: `You are the ultimate performance coach. 
        Break goals into high-impact tasks. 
        
        Return JSON format ONLY:
        {
          "reply": "Concise coach-like response.",
          "suggestedTasks": [
            {
              "title": "Clear action",
              "description": "Brief detail",
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
    const msg = error.message === "API_KEY_NOT_FOUND_IN_ENV" 
      ? "Deployment Error: API_KEY is missing. Add 'API_KEY' to Vercel and REDEPLOY." 
      : "Connection interrupted. Check your API key status.";
    return { reply: msg, suggestedTasks: [] };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `User finished ${completed}/${total} tasks. One elite productivity tip (max 8 words).`,
    });
    return response.text?.trim() || "Win the morning, win the day.";
  } catch (error) {
    return "Prioritize your most difficult task first.";
  }
};