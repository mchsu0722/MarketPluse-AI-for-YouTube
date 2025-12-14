import { GoogleGenAI } from "@google/genai";
import { SearchResponse, TrendItem, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert trend analyst for YouTube content in the Investment and Technology sectors.
Your goal is to identify the hottest NEW videos, channels, and discussions from the CURRENT WEEK (last 7 days).
You MUST use the googleSearch tool to find real-time information specifically from YouTube or about YouTube trends.

Format your response exactly as follows to allow for parsing:
1. Provide a brief introductory paragraph.
2. Output the specific date range you are analyzing in this format: "###DATE_RANGE### [Start Date] - [End Date]" (e.g., Oct 20 - Oct 27, 2023).
3. List the specific trending topics found on YouTube (quantity specified in prompt). Separate each item explicitly with the delimiter "###ITEM###".
4. Inside each item, use the following format:
   Title: [Video Title or Trending Topic Headline]
   Category: [Investment, Technology, Crypto, or AI]
   Score: [A number 1-100 representing heat/views/engagement]
   Tags: [Tag1, Tag2, Tag3]
   Summary: [Concise description of the video content/topic. YOU MUST MENTION SPECIFIC YOUTUBE CHANNELS covering this.]

5. IF the user asks for analysis:
   After the items, output the delimiter "###ANALYSIS_START###".
   Then provide a "Market Trend Analysis".
   First, provide the analysis in ENGLISH under the section header "###ANALYSIS_EN###".
   Then, provide the SAME analysis in TRADITIONAL CHINESE (繁體中文) under the section header "###ANALYSIS_ZH###".

Do not use markdown formatting like **bold** in the Title, Category, Score, or Tags lines, as it breaks parsing.
`;

export const fetchWeeklyTrends = async (limit: number = 6, includeAnalysis: boolean = false): Promise<SearchResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Explicitly mention the limit in the analysis request
    let prompt = `Find the top ${limit} most viral and trending Investment and Technology videos and topics specifically on YouTube from the past 7 days. Focus on new data, market analysis, and tech reviews. Ensure you provide exactly ${limit} distinct items.`;
    
    if (includeAnalysis) {
      prompt += ` ALSO, provide a detailed Market Trend Analysis (approx 300-500 words) summarizing the key themes and insights from ALL ${limit} items identified in this list. Provide this in both English and Traditional Chinese as instructed.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
    });

    const rawText = response.text || "";
    
    // Extract sources from grounding metadata
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
    const validSources = groundingChunks.filter(c => c.web?.uri && c.web?.title);

    // Parse the raw text into structured items
    const { trends, analysis, dateRange } = parseResponse(rawText);

    return {
      rawText,
      parsedTrends: trends,
      sources: validSources,
      analysis,
      dateRange
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch trends.");
  }
};

const parseResponse = (text: string): { trends: TrendItem[], analysis?: { en: string, zh: string }, dateRange?: string } => {
  const itemSplit = text.split("###ANALYSIS_START###");
  const itemsPart = itemSplit[0];
  const analysisPart = itemSplit.length > 1 ? itemSplit[1] : "";

  // Parse Date Range
  const dateMatch = itemsPart.match(/###DATE_RANGE###\s*(.+)/);
  const dateRange = dateMatch ? dateMatch[1].trim() : undefined;

  // Parse Items
  const parts = itemsPart.split("###ITEM###");
  const trends: TrendItem[] = [];

  parts.forEach((part, index) => {
    if (!part.trim()) return;

    const titleMatch = part.match(/Title:\s*(.+)/);
    const categoryMatch = part.match(/Category:\s*(.+)/);
    const scoreMatch = part.match(/Score:\s*(\d+)/);
    const tagsMatch = part.match(/Tags:\s*(.+)/);
    const summaryMatch = part.match(/Summary:\s*([\s\S]+)/); 

    if (titleMatch && summaryMatch) {
      trends.push({
        id: `trend-${index}-${Date.now()}`,
        title: titleMatch[1].trim(),
        category: (categoryMatch ? categoryMatch[1].trim() : 'General') as any,
        viralityScore: scoreMatch ? parseInt(scoreMatch[1], 10) : 50,
        tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
        description: summaryMatch[1].trim()
      });
    }
  });

  // Parse Analysis
  let analysis = undefined;
  if (analysisPart) {
    const enMatch = analysisPart.match(/###ANALYSIS_EN###\s*([\s\S]*?)###ANALYSIS_ZH###/);
    const zhMatch = analysisPart.match(/###ANALYSIS_ZH###\s*([\s\S]*)/);
    
    if (enMatch && zhMatch) {
      analysis = {
        en: enMatch[1].trim(),
        zh: zhMatch[1].trim()
      };
    }
  }

  return { trends, analysis, dateRange };
};
