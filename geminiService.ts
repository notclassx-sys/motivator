
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Safely initializes the Gemini client.
 * Uses process.env.API_KEY as the primary source.
 */
const getAI = async () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    // If the key is missing from process.env, check if the environment's selection helper exists
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    } else {
      throw new Error("API_KEY_NOT_CONFIGURED");
    }
  }

  // Always use a fresh instance to ensure we pick up the latest key from the environment/dialog
  return new GoogleGenAI({ apiKey: process.env.API_KEY! });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = await getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one short, simple motivational quote (max 10 words).${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "Small progress is still progress.";
  } catch (error) {
    console.error("AI Quote Error:", error);
    return "Focus on the step in front of you.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = await getAI();
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
        systemInstruction: `You are a helpful and professional daily assistant. 
        If the user wants to accomplish a goal, break it into clear, simple steps.
        
        Return JSON format ONLY:
        {
          "reply": "A brief, encouraging response.",
          "suggestedTasks": [
            {
              "title": "Clear task name",
              "description": "Short detail",
              "priority": "HIGH",
              "timeSlot": "e.g. 10:00 AM"
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

    const text = response.text || '{"reply": "Request processed.", "suggestedTasks": []}';
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Assistant Error:", error);
    if (error instanceof Error && error.message === "API_KEY_NOT_CONFIGURED") {
        return { reply: "API Key not found in environment. Please check your Vercel/System settings.", suggestedTasks: [] };
    }
    return { 
      reply: "I'm having trouble connecting to the AI core. Please ensure your API key is active.", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user completed ${completed} out of ${total} tasks today. Give one simple tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "Keep showing up every single day.";
  } catch (error) {
    return "Focus on one priority at a time.";
  }
};
