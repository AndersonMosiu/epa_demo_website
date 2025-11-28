import React, { useState, useEffect } from 'react';
import { newsAPI, eventsAPI } from '../services/api';
import type { NewsItem, EventItem } from '../types';
import { useNavigate } from 'react-router-dom';

const NewsEvents: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load news
      const newsResponse = await newsAPI.getAll();
      setNewsItems(newsResponse.news);
      
      // Load featured news
      const featured = await newsAPI.getFeatured();
      setFeaturedNews(featured);
      
      // Load events
      const events = await eventsAPI.getUpcoming();
      setEventItems(events);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to sample data if API fails
      setNewsItems(getSampleNews());
      setFeaturedNews(getSampleNews().filter(item => item.isFeatured));
      setEventItems(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Keep your existing sample data as fallback
  const getSampleNews = (): NewsItem[] => [
    {
      id: 1,
      title: "Eastern Pacific Academy Wins National Science Fair",
      summary: "Our students secured first place in the National Science and Innovation Fair with their renewable energy project.",
      date: "2024-03-15",
      category: "Achievements",
      isFeatured: true
    },
    // ... other sample news
  ];

  const getSampleEvents = (): EventItem[] => [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      description: "Quarterly meeting between parents and teachers to discuss student progress",
      date: "2024-04-15",
      time: "9:00 AM - 3:00 PM",
      location: "School Auditorium",
      type: "academic"
    },
    // ... other sample events
  ];

  // Update the getImageUrl function
  const getImageUrl = (item: NewsItem | EventItem) => {
    if (item.imageUrl) {
      // If it's already a full URL, use it directly
      if (item.imageUrl.startsWith('http')) {
        return item.imageUrl;
      }
      // Otherwise, prepend the backend URL
      return `http://localhost:5000${item.imageUrl}`;
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sports':
        return 'var(--accent-red)';
      case 'academic':
        return 'var(--primary-blue)';
      case 'event':
        return 'var(--accent-gold)';
      case 'cultural':
        return 'var(--accent-green)';
      default:
        return 'var(--primary-dark)';
    }
  };

  if (loading) {
    return (
      <section id="news" className="news-events-modern py-5">
        <div className="container">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="news-events-modern py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className="section-title">News & Events</h2>
            <p className="section-subtitle">Stay updated with the latest happenings at Eastern Pacific Academy</p>
          </div>
        </div>

      {/* Featured News */}
{/* Featured News */}
<div className="row mb-5">
  <div className="col-12">
    <h3 className="mb-4">Featured News</h3>
  </div>
  {featuredNews.slice(0, 2).map((news) => ( 
    <div key={news._id || news.id} className="col-lg-6 mb-4">
      <div className="featured-news-card">
        <div className="news-category-tag">{news.category}</div>

        {getImageUrl(news) && (
          <div className="featured-news-image">
            <img 
              src={getImageUrl(news)!} 
              alt={news.title}
            />
          </div>
        )}
        
        <h4 className="news-title">{news.title}</h4>
        <p className="news-summary">{news.summary}</p>
        <div className="news-date">{formatDate(news.date)}</div>
        {news.isFeatured && (
          <span className="featured-badge">
              <i className="bi bi-star-fill"></i>
              Featured</span>
        )}
      </div>
    </div>
  ))}
</div>
        <div className="row">
          {/* News Section */}
          <div className="col-lg-8 mb-5">
            <div className="row">
              <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ color: 'var(--primary-dark)', margin: 0 }}>Latest News</h3>
                <button className="btn-view-all" onClick={() => navigate('/news')}>View All News</button>
              </div>
              
              {newsItems.slice(0, 4).map((news) => (
                <div key={news._id || news.id} className="col-12 mb-4">
                  <div className="news-item-card">
                    <div className="row g-0">
                      <div className={getImageUrl(news) ? "col-md-8" : "col-12"}>
                        <div className="news-content">
                          <span className="news-category">{news.category}</span>
                          {news.isFeatured && (
                            <span className="featured-badge ms-2">  <i className="bi bi-star-fill"></i>Featured</span>
                          )}
                          <h5 className="news-item-title">{news.title}</h5>
                          <p className="news-item-summary">{news.summary}</p>
                          <div className="news-item-date"><i className="bi bi-calendar-event primary"></i>{formatDate(news.date)}</div>
                        </div>
                      </div>
                        {getImageUrl(news) && (
                        <div className="col-md-4">
                          <div className="news-image-container">
                            <img 
                              src={getImageUrl(news)!} 
                              alt={news.title}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="col-lg-4">
            <div className="events-sidebar">
              <h3 className="events-title">Upcoming Events</h3>
              
              {eventItems.slice(0, 2).map((event) => ( 
                <div key={event._id || event.id} className="event-card">
                  <div 
                    className="event-type-indicator"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="event-content">
                    {getImageUrl(event) && (
                      <div className="event-image mb-2">
                        <img 
                          src={getImageUrl(event)!} 
                          alt={event.title}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    )}
                    <h6 className="event-card-title">{event.title}</h6>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <div className="event-detail">
                        <i className="bi bi-calendar-event"></i>
                        {formatDate(event.date)}
                      </div>
                      <div className="event-detail">
                        <i className="bi bi-clock"></i>
                        {event.time}
                      </div>
                      <div className="event-detail">
                        <i className="bi bi-geo-alt"></i>
                        {event.location}
                      </div>
                    </div>
                    <div className="event-type-badge">
                      {event.type}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="btn-view-all-events" onClick={() => navigate('/events')}>
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

    <style>{`
  .featured-news-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 100%;
    transition: transform 0.2s ease;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .featured-news-card:hover {
    transform: translateY(-2px);
  }
  
  .news-category-tag {
    background: #0d6efd; /* Fallback for --primary-blue */
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
    align-self: flex-start;
  }
  
  .featured-news-image {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .featured-news-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }
  
  .news-title {
    color: #000 !important;
    font-size: 1.25rem !important;
    font-weight: 600;
    margin: 10px 0 !important;
    line-height: 1.3;
  }
  
  .news-summary {
    color: #666 !important;
    line-height: 1.5 !important;
    margin-bottom: 10px !important;
  }
  
  .news-date {
    color: #888 !important;
    font-size: 0.9rem !important;
  }
  
  .featured-badge {
    background: #ffd700 !important;
    color: #000 !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 0.7rem;
    font-weight: 600;
    display: inline-block;
    margin-top: 0.5rem;
  }

  /* News Items Section */
  .news-item-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }
  
  .news-item-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .news-content {
    padding-right: 1rem;
  }
  
  .news-item-title {
    color: #000 !important;
    font-size: 1.1rem !important;
    font-weight: 600;
    margin: 0.5rem 0 !important;
  }
  
  .news-item-summary {
    color: #666 !important;
    line-height: 1.5 !important;
    margin-bottom: 0.5rem !important;
  }
  
  .news-item-date {
    color: #888 !important;
    font-size: 0.85rem !important;
  }

  /* Events Section */
  .event-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .event-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .event-type-indicator {
    width: 4px;
    border-radius: 2px;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .event-content {
    flex: 1;
  }
  
  .event-card-title {
    color: #000 !important;
    font-size: 1rem !important;
    font-weight: 600;
    margin-bottom: 0.5rem !important;
  }
  
  .event-description {
    color: #666 !important;
    line-height: 1.4 !important;
    margin-bottom: 0.75rem !important;
    font-size: 0.9rem;
  }
  
  .event-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .event-detail {
    color: #888 !important;
    font-size: 0.85rem !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-view-all, .btn-view-all-events {
    background: #0d6efd;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
    font-size: 0.9rem;
  }
  
  .btn-view-all:hover, .btn-view-all-events:hover {
    background: #0b5ed7;
  }

  /* Section Titles */
  .section-title {
    color: #000 !important;
    font-size: 2rem !important;
    font-weight: 700;
    margin-bottom: 0.5rem !important;
  }
  
  .section-subtitle {
    color: #666 !important;
    font-size: 1.1rem !important;
    margin-bottom: 2rem !important;
  }
`}</style>
    </section>
  );
};

export default NewsEvents;