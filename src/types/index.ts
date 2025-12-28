export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  ticker: string;
}

export interface Stock {
  ticker: string;
  name: string;
  industry: string;
  sector: string;
}

export interface UserSubscription {
  userId: string;
  tickers: string[];
}

export interface Industry {
  name: string;
  sector: string;
}
