
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Standard model for basic text tasks as per guidelines
const MODEL_NAME = 'gemini-3-flash-preview';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nDon't use these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write one very short motivational quote (under 10 words). Make it simple and inspiring.${excludeList}`,
      config: { temperature: 0.7 }
    });
    return response.text?.trim() || "Every small step counts towards your goal.";
  } catch (error) {
    return "You are capable of amazing things.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = getAI();
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
        systemInstruction: `You are a simple and helpful day planner. 
        If a user wants to achieve a goal, break it down into easy tasks with times.
        
        Always return JSON:
        {
          "reply": "A short friendly message",
          "suggestedTasks": [
            {"title": "Simple Task Name", "description": "Quick info", "priority": "HIGH/MEDIUM/LOW", "timeSlot": "9:00 AM"}
          ]
        }`,
        responseMimeType: 'application/json',
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
                }
              }
            }
          },
          required: ["reply", "suggestedTasks"]
        }
      }
    });

    return JSON.parse(response.text || '{"reply": "I heard you. How else can I help?", "suggestedTasks": []}');
  } catch (error) {
    console.error("AI Error:", error);
    if (error.message?.includes("API Key")) {
      return { reply: "API Key error. Please check your settings.", suggestedTasks: [] };
    }
    return { reply: "I'm having a little trouble connecting. Please try again.", suggestedTasks: [] };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user finished ${completed} out of ${total} tasks today. Give one tiny tip to keep going (10 words max).`,
    });
    return response.text?.trim() || "You're doing great. Take it one task at a time.";
  } catch (error) {
    return "Keep moving forward, you've got this!";
  }
};
