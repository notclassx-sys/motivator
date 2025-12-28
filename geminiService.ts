import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Connects to the AI using your secret key.
 */
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("Missing API Key");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuote = async (seenQuotes: string[] = []) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Write a short, friendly, and very encouraging motivational quote for a person trying to stay productive. Use simple words. Maximum 10 words.",
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "You are doing a great job!";
  } catch (error) {
    console.error("AI Quote Error:", error);
    return "Keep going, you've got this!";
  }
};

// Kept simple for manual mode
export const chatForTasks = async (userInput: string, chatHistory: any[]) => ({ reply: "", suggestedTasks: [] });
export const analyzeProductivity = async (completed: number, total: number) => "";