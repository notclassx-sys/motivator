import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * AI client is still available for other tasks if needed, 
 * but quote generation is now local as requested.
 */
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("Missing API Key");
  }
  return new GoogleGenAI({ apiKey });
};

// Quotes are now handled locally in the UI
export const generateQuote = async (seenQuotes: string[] = []) => "";

// Kept simple for manual mode
export const chatForTasks = async (userInput: string, chatHistory: any[]) => ({ reply: "", suggestedTasks: [] });
export const analyzeProductivity = async (completed: number, total: number) => "";