
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Using the stable 'lite' model as requested
const MODEL_NAME = 'gemini-flash-lite-latest';

/**
 * Initializes the Gemini API client safely.
 * Directly uses process.env.API_KEY.
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  // Strictly check if the key is valid before initializing
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("Gemini API Key is currently missing or invalid.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    if (!ai) return "Success is a series of small wins.";

    const excludeList = seenQuotes.length > 0 ? `\n\nExclude: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one short, simple motivational quote (max 10 words).${excludeList}`,
      config: { temperature: 0.8 }
    });
    return response.text?.trim() || "Small progress is still progress.";
  } catch (error) {
    console.error("Quote Generation Error:", error);
    return "Focus on the step in front of you.";
  }
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = getAI();
    if (!ai) return { reply: "I'm waiting for the API key to be ready. Please check your settings.", suggestedTasks: [] };

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
              "priority": "HIGH", "MEDIUM", or "LOW",
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
      reply: "I'm having a little trouble connecting. Can you try again?", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    if (!ai) return "Consistency is key to results.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user completed ${completed} out of ${total} tasks today. Give one simple tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "Take a deep breath and start the next task.";
  } catch (error) {
    return "Focus on one thing at a time.";
  }
};
