
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// User requested a 'lower level' model (lite)
const MODEL_NAME = 'gemini-flash-lite-latest';

/**
 * Initializes the Gemini API client safely.
 * Returns null if the API key is not yet available to prevent SDK crashes.
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    if (!ai) return "Focus on the step in front of you.";

    const excludeList = seenQuotes.length > 0 ? `\n\nExclude: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Short motivational quote (max 10 words).${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "Small progress is still progress.";
  } catch (error) {
    console.error("Quote Error:", error);
    return "The best way to predict the future is to create it.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = getAI();
    if (!ai) return { reply: "API Key not ready. Please check your settings.", suggestedTasks: [] };

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
        systemInstruction: `You are a helpful and simple daily assistant. 
        If the user wants to plan something, break it into simple tasks with times.
        
        Return JSON ONLY:
        {
          "reply": "Friendly message",
          "suggestedTasks": [
            {"title": "Task name", "description": "Short info", "priority": "HIGH", "timeSlot": "10:00 AM"}
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

    return JSON.parse(response.text || '{"reply": "I understand. How else can I help?", "suggestedTasks": []}');
  } catch (error) {
    console.error("AI Error:", error);
    return { reply: "I'm having a connection issue. Can you try again?", suggestedTasks: [] };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    if (!ai) return "Keep taking small steps forward.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user finished ${completed}/${total} tasks today. Give 1 tiny tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "One task at a time is the way to win.";
  } catch (error) {
    return "Stay focused on your next goal.";
  }
};
