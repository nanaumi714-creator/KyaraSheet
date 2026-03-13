import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateBackground(prompt: string, aspectRatio: string = "16:9"): Promise<string> {
  const ai = getAIClient();
  
  // Enhance the prompt to fit the VTuber/Anime aesthetic
  const enhancedPrompt = `${prompt}, anime style background, visual novel background, high quality, masterpiece, no characters, empty scenery, highly detailed`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: enhancedPrompt }
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      },
    },
  });

  // Iterate through parts to find the image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image: No image data returned from API.");
}
