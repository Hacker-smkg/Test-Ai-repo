export interface Word {
  id: number;
  word: str;
  sentiment_type: 'positive' | 'negative' | 'neutral';
}

export interface AnalyzeResponse {
  extracted_text: string;
  sentiment_score: number;
  sentiment: string;
}
