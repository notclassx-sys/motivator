
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

// Standard model for basic text and reasoning tasks
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Initializes the Gemini API client.
 * Strictly uses process.env.API_KEY as per system requirements.
 */
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getAI();
    const excludeList = seenQuotes.length > 0 ? `\n\nExclude these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide one short, simple motivational quote (max 12 words).${excludeList}`,
      config: { temperature: 0.8 }
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
        When the user wants to accomplish a goal, break it into clear, simple steps.
        
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
    console.error("AI Assistant Error:", error);
    return { 
      reply: "I'm having a little trouble connecting right now. Can we try again in a moment?", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user completed ${completed} out of ${total} tasks today. Give one simple tip for better focus (max 12 words).`,
    });
    return response.text?.trim() || "Stay hydrated and take short breaks between tasks.";
  } catch (error) {
    return "Focus on one thing at a time to stay productive.";
  }
};
