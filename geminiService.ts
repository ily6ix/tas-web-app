
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Provides personalized beauty recommendations based on user concerns and skin type.
 */
export async function getBeautyRecommendations(concern: string, skinType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `User has ${skinType} skin and is concerned about ${concern}. 
  Recommend 3 beauty routines or treatments available at TA's Beauty Lounge. 
  Keep the tone luxurious and professional.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  benefit: { type: Type.STRING }
                },
                required: ["title", "description", "benefit"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const jsonStr = response.text?.trim() || "{\"recommendations\": []}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Consultation Error:", error);
    return null;
  }
}

/**
 * Fetches area insights for the Beauty Lounge location using Google Maps grounding.
 */
export async function getLocationInsights() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Coordinates for Midrand area roughly if needed, but the tool handles text queries too.
  const prompt = `Tell me about the area around 563 Seventh Road, Midrand where TA's Beauty Lounge is located. 
  Mention some nearby landmarks or why it's a great spot for a luxury lounge. 
  Format the response as a short, elegant paragraph.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Maps grounding works better in 2.5 series
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || "View on Maps",
        uri: chunk.maps?.uri
      })) || []
    };
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return null;
  }
}
