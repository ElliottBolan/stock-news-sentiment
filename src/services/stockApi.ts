import type { NewsArticle, Stock } from '../types';

// For demo purposes, we'll use mock data
// In production, you would integrate with real APIs like Alpha Vantage, Finnhub, or News API

const MOCK_STOCKS: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', industry: 'Consumer Electronics', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', industry: 'Software', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', industry: 'Internet Services', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', industry: 'E-commerce', sector: 'Consumer Cyclical' },
  { ticker: 'TSLA', name: 'Tesla Inc.', industry: 'Auto Manufacturers', sector: 'Consumer Cyclical' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', industry: 'Banking', sector: 'Financial Services' },
  { ticker: 'V', name: 'Visa Inc.', industry: 'Credit Services', sector: 'Financial Services' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', industry: 'Pharmaceuticals', sector: 'Healthcare' },
  { ticker: 'WMT', name: 'Walmart Inc.', industry: 'Retail', sector: 'Consumer Defensive' },
  { ticker: 'PG', name: 'Procter & Gamble', industry: 'Consumer Goods', sector: 'Consumer Defensive' },
];

const generateMockNews = (ticker: string, count: number = 5): NewsArticle[] => {
  const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
  const titles = [
    `${ticker} reports strong quarterly earnings`,
    `Analysts upgrade ${ticker} stock rating`,
    `${ticker} announces new product launch`,
    `Market volatility affects ${ticker} performance`,
    `${ticker} CEO discusses future strategy`,
    `New partnership announced for ${ticker}`,
    `${ticker} faces regulatory challenges`,
    `Innovation drives ${ticker} growth`,
  ];

  return Array.from({ length: count }, (_, i) => {
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const sentimentScore = sentiment === 'positive' ? 0.7 + Math.random() * 0.3 :
                          sentiment === 'negative' ? -0.7 - Math.random() * 0.3 :
                          -0.3 + Math.random() * 0.6;

    return {
      id: `${ticker}-${i}-${Date.now()}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: `This is a news article about ${ticker}. ${sentiment === 'positive' ? 'Positive developments' : sentiment === 'negative' ? 'Challenges ahead' : 'Mixed signals'} for the company.`,
      url: `https://example.com/news/${ticker.toLowerCase()}/${i}`,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: ['Reuters', 'Bloomberg', 'CNBC', 'WSJ'][Math.floor(Math.random() * 4)],
      sentiment,
      sentimentScore,
      ticker,
    };
  });
};

export const getStockNews = async (ticker: string): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockNews(ticker);
};

export const getMultipleStockNews = async (tickers: string[]): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const allNews = tickers.flatMap(ticker => generateMockNews(ticker, 3));
  return allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getAllStocks = async (): Promise<Stock[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_STOCKS;
};

export const getStocksByIndustry = async (industry: string): Promise<Stock[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_STOCKS.filter(stock => stock.industry === industry || stock.sector === industry);
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();
  return MOCK_STOCKS.filter(stock => 
    stock.ticker.toLowerCase().includes(lowerQuery) ||
    stock.name.toLowerCase().includes(lowerQuery)
  );
};

export const getIndustries = (): string[] => {
  const industries = new Set(MOCK_STOCKS.map(stock => stock.industry));
  return Array.from(industries).sort();
};

export const getSectors = (): string[] => {
  const sectors = new Set(MOCK_STOCKS.map(stock => stock.sector));
  return Array.from(sectors).sort();
};
