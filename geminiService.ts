
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Using the 'lite' model for better stability and compatibility
const MODEL_NAME = 'gemini-flash-lite-latest';

/**
 * Initializes the Gemini API client safely.
 * Strictly uses process.env.API_KEY as per system requirements.
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === 'undefined') {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Short motivational quote (max 10 words).${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "Small progress is still progress.";
  } catch (error) {
    return "Focus on the step in front of you.";
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
        systemInstruction: `You are a helpful daily assistant. 
        If the user wants to plan something, break it into simple tasks with times.
        
        JSON ONLY:
        {
          "reply": "Friendly message",
          "suggestedTasks": [
            {"title": "Task", "description": "Short info", "priority": "HIGH", "timeSlot": "10:00 AM"}
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
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user finished ${completed}/${total} tasks. Give 1 tiny tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "Keep taking small steps forward.";
  } catch (error) {
    return "Stay focused on your next goal.";
  }
};
