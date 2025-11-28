import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import type { NewsItem } from '../types';
import './css/AllNewsPage.css';

const AllNewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllNews();
  }, []);

  const loadAllNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNewsItems(response.news);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (news: NewsItem): string | null => {
    if (news.imageUrl) {
      if (news.imageUrl.startsWith('http')) {
        return news.imageUrl;
      }
      return `http://localhost:5000${news.imageUrl}`;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="all-news-page">
        <div className="all-news-container">
          <div className="all-news-loading">
            <div className="loading-spinner"></div>
            <p>Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-news-page">
      <div className="all-news-container">
        <div className="all-news-header">
          <h1 className="all-news-title">All News</h1>
          <p className="all-news-subtitle">
            Stay updated with all the latest news from Eastern Pacific Academy
          </p>
        </div>
        
        <div className="all-news-grid">
          {newsItems.map((news) => (
            <div key={news._id || news.id} className="news-article-card">
              {getImageUrl(news) && (
                <div className="news-article-image">
                  <img 
                    src={getImageUrl(news)!} 
                    alt={news.title}
                  />
                  <div className="news-article-overlay"></div>
                </div>
              )}
              <div className="news-article-content">
                <div className="news-article-meta">
                  <span className="news-category-badge">{news.category}</span>
                  {news.isFeatured && (
                    <span className="news-featured-badge">
                      <i className="bi bi-star-fill"></i>
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="news-article-title">{news.title}</h3>
                <p className="news-article-summary">{news.summary}</p>
                <div className="news-article-footer">
                  <div className="news-article-date">
                    <i className="bi bi-calendar"></i>
                    {formatDate(news.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {newsItems.length === 0 && (
          <div className="all-news-empty">
            <i className="bi bi-newspaper"></i>
            <h3>No News Available</h3>
            <p>Check back later for the latest updates from Eastern Pacific Academy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNewsPage;