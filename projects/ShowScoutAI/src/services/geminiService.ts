import { GoogleGenAI, Type } from "@google/genai";
import { AppSettings, NewsCard, Source } from "../types";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

interface FetchResult {
  success: boolean;
  newsItem?: NewsCard;
  error?: string;
}

export const fetchUpdatesForShow = async (
  showTitle: string,
  lastCheckedDate: string | null,
  existingHeadlines: string[],
  settings: AppSettings
): Promise<FetchResult> => {
  if (!settings.apiKey) {
    return { success: false, error: "API Key missing" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: settings.apiKey });
    
    const today = new Date().toISOString().split('T')[0];
    const lastChecked = lastCheckedDate ? new Date(lastCheckedDate).toLocaleDateString() : "Never checked before";

    const prompt = `
      You are a specialized entertainment news scout.
      
      TARGET: "${showTitle}"
      CURRENT DATE: ${today}
      LAST CHECKED BY USER: ${lastChecked}
      
      ALREADY KNOWN UPDATES (Do not report these again):
      ${existingHeadlines.length > 0 ? existingHeadlines.map(h => `- ${h}`).join('\n') : "None"}

      TASK:
      1. Use Google Search to find the *latest* production news, casting, or release dates for "${showTitle}".
      2. Filter strictly for news published AFTER "${lastChecked}". 
      3. If the news is just a rumor, fan theory, or recap of an old episode, ignore it.
      4. Compare found news against "ALREADY KNOWN UPDATES". If semantically similar, ignore it.
      
      CONTENT REQUIREMENTS:
      - Headline: Catchy and professional.
      - Summary: Write a DETAILED journalistic summary (approx. 2-3 paragraphs).
      - FORMATTING: **PLAIN TEXT ONLY**. Do NOT use Markdown (no bold, no italics, no [links]()).
      - CITATIONS: Cite sources naturally within the flow of the sentences (e.g., "According to Deadline, production begins...").
      
      OUTPUT:
      Return a JSON object. 
      Set "hasNewSignificantUpdate" to true ONLY if you found concrete, official, or major trade news that is newer than the Last Checked date.
    `;

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: prompt,
      config: {
        temperature: 0.3,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasNewSignificantUpdate: {
              type: Type.BOOLEAN,
              description: "True only if fresh, non-duplicate, significant news is found."
            },
            headline: {
              type: Type.STRING,
              description: "A short, catchy headline for the update."
            },
            summary: {
              type: Type.STRING,
              description: "A detailed 2-3 paragraph summary in plain text."
            },
            dateOfEvent: {
              type: Type.STRING,
              description: "The approximate date this news was published."
            }
          },
          required: ["hasNewSignificantUpdate"],
        },
      },
    });

    // Parse JSON Response
    const jsonText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (e) {
      console.warn("Failed to parse JSON, falling back", jsonText);
      return { success: true }; // Treat as no news to be safe
    }

    if (!parsedData.hasNewSignificantUpdate) {
      return { success: true };
    }

    // Extract Grounding Metadata for sources (still useful for listing even if inline links exist)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        sources.push({
          title: chunk.web.title || "Source",
          uri: chunk.web.uri,
        });
      }
    });

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    const newsItem: NewsCard = {
      id: generateId(),
      showTitle,
      headline: parsedData.headline || `News: ${showTitle}`,
      summary: parsedData.summary || "New update found.",
      dateFound: new Date().toISOString(),
      sources: uniqueSources,
      isRead: false,
      isArchived: false,
    };

    return { success: true, newsItem };

  } catch (error: any) {
    console.error("Gemini API Error", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};