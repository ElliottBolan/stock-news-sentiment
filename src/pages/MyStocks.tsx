import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { getMultipleStockNews, searchStocks } from '../services/stockApi';
import type { Stock } from '../types';
import NewsCard from '../components/NewsCard';
import { Star, Plus, Search, Loader, X } from 'lucide-react';
import './MyStocks.css';

const MyStocks = () => {
  const { subscriptions, isLoading: subsLoading, addSubscription, removeSubscription, isSubscribed } = useSubscriptions();
  const [showAddStock, setShowAddStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['my-stocks-news', subscriptions],
    queryFn: () => subscriptions.length > 0 ? getMultipleStockNews(subscriptions) : Promise.resolve([]),
    enabled: subscriptions.length > 0,
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });

  useEffect(() => {
    const searchStock = async () => {
      if (searchQuery.trim()) {
        const results = await searchStocks(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(searchStock, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleAddStock = (ticker: string) => {
    addSubscription(ticker);
    setSearchQuery('');
    setSearchResults([]);
    setShowAddStock(false);
  };

  const handleRemoveStock = (ticker: string) => {
    removeSubscription(ticker);
  };

  if (subsLoading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" />
        <p>Loading your stocks...</p>
      </div>
    );
  }

  return (
    <div className="my-stocks-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <Star className="page-icon" />
            My Stocks
          </h1>
          <button 
            className="add-stock-button"
            onClick={() => setShowAddStock(!showAddStock)}
          >
            <Plus className="button-icon" />
            Add Stock
          </button>
        </div>

        {showAddStock && (
          <div className="add-stock-panel">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search stocks by ticker or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="clear-icon" />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((stock) => (
                  <div key={stock.ticker} className="search-result-item">
                    <div className="stock-info">
                      <span className="stock-ticker">{stock.ticker}</span>
                      <span className="stock-name">{stock.name}</span>
                      <span className="stock-industry">{stock.industry}</span>
                    </div>
                    {isSubscribed(stock.ticker) ? (
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveStock(stock.ticker)}
                      >
                        <Star className="star-icon filled" />
                        Subscribed
                      </button>
                    ) : (
                      <button 
                        className="subscribe-button"
                        onClick={() => handleAddStock(stock.ticker)}
                      >
                        <Star className="star-icon" />
                        Subscribe
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {subscriptions.length === 0 ? (
        <div className="empty-state">
          <Star className="empty-icon" />
          <h2>No stocks subscribed yet</h2>
          <p>Add stocks to see their latest news and sentiment analysis</p>
          <button 
            className="add-stock-button primary"
            onClick={() => setShowAddStock(true)}
          >
            <Plus className="button-icon" />
            Add Your First Stock
          </button>
        </div>
      ) : (
        <>
          <div className="subscribed-stocks">
            <h3>Subscribed Stocks</h3>
            <div className="stock-chips">
              {subscriptions.map((ticker) => (
                <div key={ticker} className="stock-chip">
                  <span>{ticker}</span>
                  <button
                    onClick={() => handleRemoveStock(ticker)}
                    className="chip-remove"
                    title="Unsubscribe"
                  >
                    <X className="chip-icon" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {newsLoading ? (
            <div className="loading-container">
              <Loader className="spinner" />
              <p>Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            <div className="news-grid">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="empty-news">
              <p>No news available for your subscribed stocks</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyStocks;
