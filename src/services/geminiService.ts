import { GoogleGenAI, Type } from "@google/genai";
import { Trip, TripItem } from "../types";

// Always use process.env.API_KEY as per guidelines
// Ensure fallback to empty string to prevent crash during initialization if env is missing
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTripAdvice = async (trip: Trip, items: TripItem[], question: string): Promise<string> => {
  if (!apiKey) {
    return "Error: API_KEY no está configurada en las variables de entorno. La IA no puede responder.";
  }

  const context = `
    I am planning a trip to ${trip.destination_city}, ${trip.destination_country} from ${trip.start_date} to ${trip.end_date}.
    Here is my current itinerary:
    ${items.map(i => `- ${i.start_time}: ${i.title} (${i.type})`).join('\n')}
    
    User Question: ${question}
    
    Provide a helpful, concise response. Use formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I encountered an error consulting the AI.";
  }
};

export const parseDocument = async (base64Image: string, mimeType: string): Promise<any> => {
    if (!apiKey) {
        throw new Error("API_KEY missing");
    }

    // This function simulates the n8n + LLM parsing pipeline directly in the browser for demo
    const prompt = `
      Analyze this travel document (ticket, reservation, receipt). 
      Extract the details into the specified JSON structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Image } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING },
                        title: { type: Type.STRING },
                        start_time: { type: Type.STRING },
                        end_time: { type: Type.STRING },
                        location: { type: Type.STRING },
                        details: { type: Type.STRING }
                    },
                    required: ["type", "title", "start_time"],
                }
            }
        });
        
        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Parsing failed", e);
        throw e;
    }
};
