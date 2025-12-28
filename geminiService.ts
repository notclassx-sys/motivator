
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Using a stable model name to avoid 403 Forbidden issues with preview models
const MODEL_NAME = 'gemini-flash-latest';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nAvoid these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Give me 1 short, very simple motivational quote (max 10 words). Include quote and author. Be unique and positive.${excludeList}`,
      config: { temperature: 0.8 }
    });
    return response.text?.trim() || "Small steps lead to big changes.";
  } catch (error) {
    return "Believe in yourself and all that you are.";
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
        systemInstruction: `You are a helpful daily planning assistant. 
        If the user asks to plan something (like "complete 4 chapters"), suggest specific tasks with times.
        
        Return JSON with:
        1. 'reply': A short, friendly confirmation.
        2. 'suggestedTasks': An array of tasks (title, description, priority, timeSlot).
        Priority must be LOW, MEDIUM, or HIGH.`,
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

    // Directly use .text property as per guidelines
    const resultText = response.text || '{}';
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      reply: "I'm having a bit of trouble connecting to my brain. Can you try saying that again?", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user finished ${completed} out of ${total} tasks. Give 1 tiny tip to stay focused (max 10 words).`,
    });
    return response.text?.trim() || "Take a 5-minute break and then start the next task.";
  } catch (error) {
    return "Keep moving forward, one step at a time.";
  }
};
