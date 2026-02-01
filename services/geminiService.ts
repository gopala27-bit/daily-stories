
import { GoogleGenAI, Type } from "@google/genai";
import { Note } from "../types";

export const generateDailyInsight = async (notes: Note[]) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const context = notes
    .slice(0, 5)
    .map(n => `Title: ${n.title}\nContent: ${n.content}`)
    .join("\n---\n");

  const prompt = `Based on these recent journal entries, provide a helpful summary of the user's mood and 3 actionable self-care or productivity suggestions.
  Entries:
  ${context}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief summary of mood/themes" },
          suggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3 actionable items" 
          }
        },
        required: ["summary", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
