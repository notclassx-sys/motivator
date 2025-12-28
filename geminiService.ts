
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from "./types";

/**
 * CASCADING NEURAL LINK SYSTEM
 * Strictly uses the 3 provided high-capacity keys.
 * Rotates automatically on quota limits.
 */
const MASTER_KEYS = [
  'AIzaSyC5TElJE6A5pCCBud0dq5cJQ-mgY_M0FVk', // Alpha Link
  'AIzaSyBmLUKYQseNL3rsYXiWCwFPKXHmqgz-tJc', // Beta Link
  'AIzaSyBplBN5DvPw0u7Qj0hy4v6n9sPnT9wWMaI'  // Gamma Link
];

let activeKeyIndex = 0;

/**
 * Executes AI operations with silent failover logic.
 * The user never sees a "Quota Exceeded" message unless all 3 keys are exhausted.
 */
async function executeWithFailover<T>(operation: (ai: any) => Promise<T>): Promise<T> {
  const attemptLimit = MASTER_KEYS.length;
  let lastError: any;

  for (let i = 0; i < attemptLimit; i++) {
    const currentKey = MASTER_KEYS[activeKeyIndex];
    const ai = new GoogleGenAI({ apiKey: currentKey });
    
    try {
      return await operation(ai);
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message?.toLowerCase() || "";
      
      // Rotate on rate limits or quota exhaustion
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        activeKeyIndex = (activeKeyIndex + 1) % MASTER_KEYS.length;
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error("Neural Infrastructure Saturated.");
}

export const generateQuote = async (seenQuotes: string[] = []) => {
  return executeWithFailover(async (ai) => {
    const excludeList = seenQuotes.length > 0 ? `\n\nAvoid these: ${seenQuotes.join(', ')}` : "";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me 1 short, high-impact motivational quote (max 10 words). Include quote and author. Be unique.${excludeList}`,
      config: { temperature: 0.9 }
    });
    return response.text?.trim() || "The best way to predict the future is to create it.";
  }).catch(() => "Action is the foundational key to all success.");
};

export const chatForTasks = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  return executeWithFailover(async (ai) => {
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
        systemInstruction: `You are a high-performance strategic coach. 
        
        RESPONSE PROTOCOL:
        1. 'reply': Exactly ONE punchy sentence (max 10 words).
        2. 'suggestedTasks': Mandatory JSON array of mission targets.
           - title: 2-3 words, uppercase.
           - description: 10 words max.
           - priority: LOW, MEDIUM, or HIGH.
        3. No raw text output outside JSON.`,
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
    return JSON.parse(cleanJson || '{"reply": "Parameters received.", "suggestedTasks": []}');
  }).catch(() => ({ reply: "Neural link re-stabilizing. Input received.", suggestedTasks: [] }));
};

export const analyzeProductivity = async (completed: number, total: number) => {
  return executeWithFailover(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Status: ${completed}/${total} completed. 2 brief tactical insights (15 words total).`,
    });
    return response.text?.trim() || "Efficiency stable. Maintain current velocity.";
  }).catch(() => "Tactical link offline. Mission priority: Execution.");
};
