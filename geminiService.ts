
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Always initialize with process.env.API_KEY as per system requirements.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nAvoid these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me 1 short, very simple motivational quote (max 10 words). Include quote and author. Be unique and positive.${excludeList}`,
      config: { temperature: 0.8 }
    });
    return response.text?.trim() || "Small steps lead to big changes.";
  } catch (error) {
    return "The best way to get started is to quit talking and begin doing.";
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
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are a helpful daily assistant. 
        
        RULES:
        1. 'reply': One simple, friendly sentence.
        2. 'suggestedTasks': A list of tasks if the user asked to plan something.
           - title: Simple name (e.g., "DRINK WATER").
           - description: Short description.
           - priority: LOW, MEDIUM, or HIGH.
           - timeSlot: Simple time like "9:00 AM".
        3. Only return JSON.`,
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

    const cleanJson = response.text?.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson || '{"reply": "I understand. What else?", "suggestedTasks": []}');
  } catch (error) {
    return { reply: "I'm here to help. What's on your mind?", suggestedTasks: [] };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User has finished ${completed} out of ${total} tasks today. Give 2 very short, simple tips to stay productive (max 15 words).`,
    });
    return response.text?.trim() || "Great job! Keep going one task at a time.";
  } catch (error) {
    return "Focus on your next task. You are doing well!";
  }
};
