
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Using the recommended stable model for text tasks
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Helper to safely initialize the AI client.
 * If the key is missing, it returns null instead of throwing an SDK error.
 */
const getSafeAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("AI Service: API Key is not configured in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getSafeAI();
    if (!ai) return "Small steps lead to big results.";

    const excludeList = seenQuotes.length > 0 ? `\n\nExclude: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Short motivational quote (max 10 words).${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "Progress is progress, no matter how small.";
  } catch (error) {
    console.error("Quote Error:", error);
    return "Focus on the step in front of you.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = getSafeAI();
    if (!ai) return { 
      reply: "I'm currently in offline mode (API key not found). Please ensure your environment is configured.", 
      suggestedTasks: [] 
    };

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

    const text = response.text || '{"reply": "I processed your request.", "suggestedTasks": []}';
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return { 
      reply: "I'm having a little trouble connecting. Please try again later.", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getSafeAI();
    if (!ai) return "Every completed task is a victory.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user completed ${completed} out of ${total} tasks today. Give one simple tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "Consistency is the key to results.";
  } catch (error) {
    return "Focus on one thing at a time.";
  }
};
