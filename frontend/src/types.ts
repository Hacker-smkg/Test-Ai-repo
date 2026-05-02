export interface Word {
  id: number;
  word: string;
  sentiment_type: 'positive' | 'negative' | 'neutral';
}

export interface AnalyzeResponse {
  extracted_text: string;
  sentiment_score: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}
