import type { NewsArticle } from '../types';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './NewsCard.css';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <TrendingUp className="sentiment-icon positive" />;
      case 'negative':
        return <TrendingDown className="sentiment-icon negative" />;
      default:
        return <Minus className="sentiment-icon neutral" />;
    }
  };

  const getSentimentClass = () => {
    return `sentiment-badge ${article.sentiment}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="news-card">
      <div className="news-header">
        <div className="news-meta">
          <span className="news-ticker">{article.ticker}</span>
          <span className="news-source">{article.source}</span>
          <span className="news-date">{formatDate(article.publishedAt)}</span>
        </div>
        <div className={getSentimentClass()}>
          {getSentimentIcon()}
          <span className="sentiment-text">
            {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
          </span>
          <span className="sentiment-score">
            {(article.sentimentScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <h3 className="news-title">{article.title}</h3>
      <p className="news-description">{article.description}</p>

      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="read-more"
      >
        Read full article
        <ExternalLink className="external-icon" />
      </a>
    </div>
  );
};

export default NewsCard;
