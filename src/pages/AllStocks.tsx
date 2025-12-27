import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllStocks, getStockNews, getIndustries, getSectors } from '../services/stockApi';
import { useSubscriptions } from '../hooks/useSubscriptions';
import NewsCard from '../components/NewsCard';
import { TrendingUp, Filter, Star, Loader, ChevronDown } from 'lucide-react';
import './AllStocks.css';

const AllStocks = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: stocks = [], isLoading: stocksLoading } = useQuery({
    queryKey: ['all-stocks'],
    queryFn: getAllStocks,
  });

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['stock-news', selectedStock],
    queryFn: () => selectedStock ? getStockNews(selectedStock) : Promise.resolve([]),
    enabled: !!selectedStock,
    refetchInterval: 60000,
  });

  const { isSubscribed, addSubscription, removeSubscription } = useSubscriptions();

  const industries = getIndustries();
  const sectors = getSectors();

  const filteredStocks = stocks.filter(stock => {
    if (industryFilter && stock.industry !== industryFilter) return false;
    if (sectorFilter && stock.sector !== sectorFilter) return false;
    return true;
  });

  const handleStockSelect = (ticker: string) => {
    setSelectedStock(ticker === selectedStock ? null : ticker);
  };

  const handleToggleSubscription = (ticker: string) => {
    if (isSubscribed(ticker)) {
      removeSubscription(ticker);
    } else {
      addSubscription(ticker);
    }
  };

  const clearFilters = () => {
    setIndustryFilter('');
    setSectorFilter('');
  };

  const activeFiltersCount = [industryFilter, sectorFilter].filter(Boolean).length;

  if (stocksLoading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" />
        <p>Loading stocks...</p>
      </div>
    );
  }

  return (
    <div className="all-stocks-page">
      <div className="page-header">
        <h1 className="page-title">
          <TrendingUp className="page-icon" />
          All Stocks
        </h1>
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="button-icon" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
          <ChevronDown className={`chevron ${showFilters ? 'open' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="sector-filter">Sector</label>
            <select
              id="sector-filter"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="industry-filter">Industry</label>
            <select
              id="industry-filter"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="content-layout">
        <div className="stocks-list">
          <h2 className="section-title">
            Stocks ({filteredStocks.length})
          </h2>
          {filteredStocks.length === 0 ? (
            <div className="empty-state">
              <p>No stocks found matching your filters</p>
            </div>
          ) : (
            <div className="stock-items">
              {filteredStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  className={`stock-item ${selectedStock === stock.ticker ? 'selected' : ''}`}
                  onClick={() => handleStockSelect(stock.ticker)}
                >
                  <div className="stock-main">
                    <div className="stock-header">
                      <span className="stock-ticker">{stock.ticker}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSubscription(stock.ticker);
                        }}
                        className={`star-button ${isSubscribed(stock.ticker) ? 'subscribed' : ''}`}
                        title={isSubscribed(stock.ticker) ? 'Unsubscribe' : 'Subscribe'}
                      >
                        <Star className={`star-icon ${isSubscribed(stock.ticker) ? 'filled' : ''}`} />
                      </button>
                    </div>
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-tags">
                      <span className="stock-tag sector">{stock.sector}</span>
                      <span className="stock-tag industry">{stock.industry}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="news-section">
          {!selectedStock ? (
            <div className="empty-news-state">
              <TrendingUp className="empty-icon" />
              <h3>Select a stock to view news</h3>
              <p>Click on any stock from the list to see latest news and sentiment analysis</p>
            </div>
          ) : (
            <>
              <h2 className="section-title">
                News for {selectedStock}
              </h2>
              {newsLoading ? (
                <div className="loading-container">
                  <Loader className="spinner" />
                  <p>Loading news...</p>
                </div>
              ) : news.length > 0 ? (
                <div className="news-list">
                  {news.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="empty-news-state">
                  <p>No news available for this stock</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStocks;
