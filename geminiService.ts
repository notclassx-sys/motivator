
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Initializes the AI client using the mandatory process.env.API_KEY.
 */
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY_NOT_FOUND");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getClient();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude these specifically: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one powerful, elite motivational quote for a high-performer (max 12 words).${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "The king does not look back.";
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
          "reply": "A concise, motivating response from a world-class mentor.",
          "suggestedTasks": [
            {
              "title": "Clear action-oriented task",
              "description": "High-level detail",
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
    return { 
      reply: error.message === "API_KEY_NOT_FOUND" 
        ? "System Alert: API_KEY is missing in your environment settings. Please add it to Vercel." 
        : "I'm temporarily offline. Check your network or API key status.", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user finished ${completed}/${total} tasks. Provide one elite strategy for increasing focus tomorrow (max 10 words).`,
    });
    return response.text?.trim() || "Consolidate your efforts on a single priority.";
  } catch (error) {
    return "Optimize your workflow for maximum output.";
  }
};
