export interface TrendItem {
  id: string;
  title: string;
  description: string;
  category: 'Investment' | 'Technology' | 'Crypto' | 'AI' | 'General';
  viralityScore: number; // 0-100
  tags: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResponse {
  rawText: string;
  parsedTrends: TrendItem[];
  sources: GroundingChunk[];
  dateRange?: string;
  analysis?: {
    en: string;
    zh: string;
  };
}

export interface SearchState {
  isLoading: boolean;
  data: SearchResponse | null;
  error: string | null;
}