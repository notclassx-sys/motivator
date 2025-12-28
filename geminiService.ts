
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Safely retrieves the API key from the environment.
 */
const getApiKey = () => {
  try {
    const key = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!key || key === 'undefined' || key === '') return null;
    return key;
  } catch {
    return null;
  }
};

/**
 * Ensures a key is available or prompts the user.
 */
const ensureAiReady = async (): Promise<GoogleGenAI | null> => {
  let apiKey = getApiKey();
  
  if (!apiKey) {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      console.warn("AI Service: API Key missing. Opening selector...");
      await window.aistudio.openSelectKey();
      // After opening, we assume success as per instructions
      apiKey = getApiKey(); 
    }
  }

  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = await ensureAiReady();
    if (!ai) return "Success is built one step at a time.";

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
    const ai = await ensureAiReady();
    if (!ai) return { 
      reply: "AI key not detected. Please tap the AI status icon in your profile to configure it.", 
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

    const text = response.text || '{"reply": "Request processed.", "suggestedTasks": []}';
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return { 
      reply: "The AI is currently unavailable. Please check your network or API key status.", 
      suggestedTasks: [] 
    };
  }
};

export const analyzeProductivity = async (completed: number, total: number) => {
  try {
    const ai = await ensureAiReady();
    if (!ai) return "Consistency is the key to mastery.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `The user completed ${completed} out of ${total} tasks today. Give one simple tip for focus (max 10 words).`,
    });
    return response.text?.trim() || "Keep showing up every single day.";
  } catch (error) {
    return "Focus on one priority at a time.";
  }
};
