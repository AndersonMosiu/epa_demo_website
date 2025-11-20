// Components/NewsEvents.tsx
import React from 'react';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'event' | 'sports' | 'academic';
}

const NewsEvents: React.FC = () => {
  // Sample news data
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Eastern Pacific Academy Wins National Science Fair",
      summary: "Our students secured first place in the National Science and Innovation Fair with their renewable energy project.",
      date: "2024-03-15",
      category: "Achievements",
      isFeatured: true
    },
    {
      id: 2,
      title: "New Computer Lab Facility Opened",
      summary: "State-of-the-art computer lab with latest technology to enhance digital learning experience.",
      date: "2024-03-10",
      category: "Facilities"
    },
    {
      id: 3,
      title: "Annual Cultural Day Celebration",
      summary: "Students showcased diverse cultural heritage through traditional performances and exhibitions.",
      date: "2024-03-05",
      category: "Events"
    },
    {
      id: 4,
      title: "Scholarship Program Announcement",
      summary: "Applications now open for the 2024 Academic Excellence Scholarship program.",
      date: "2024-02-28",
      category: "Admissions"
    }
  ];

  // Sample events data
  const eventItems: EventItem[] = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      description: "Quarterly meeting between parents and teachers to discuss student progress",
      date: "2024-04-15",
      time: "9:00 AM - 3:00 PM",
      location: "School Auditorium",
      type: "academic"
    },
    {
      id: 2,
      title: "Inter-School Sports Tournament",
      description: "Annual sports competition featuring basketball, volleyball and athletics",
      date: "2024-04-22",
      time: "8:00 AM - 5:00 PM",
      location: "School Sports Ground",
      type: "sports"
    },
    {
      id: 3,
      title: "Career Guidance Workshop",
      description: "Professional development session for Grade 12 students",
      date: "2024-04-08",
      time: "10:00 AM - 12:00 PM",
      location: "Library Conference Room",
      type: "academic"
    },
    {
      id: 4,
      title: "Music and Arts Festival",
      description: "Annual celebration of student talent in music, dance and visual arts",
      date: "2024-05-10",
      time: "6:00 PM - 9:00 PM",
      location: "Cultural Center",
      type: "event"
    }
  ];

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
      default:
        return 'var(--primary-dark)';
    }
  };

  return (
    <section id="news" className="news-events-section py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className="section-title">News & Events</h2>
            <p className="section-subtitle">Stay updated with the latest happenings at Eastern Pacific Academy</p>
          </div>
        </div>

        {/* Featured News */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-4" style={{ color: 'var(--primary-dark)' }}>Featured News</h3>
          </div>
          {newsItems.filter(item => item.isFeatured).map((news) => (
            <div key={news.id} className="col-lg-6 mb-4">
              <div className="featured-news-card">
                <div className="news-category-tag">{news.category}</div>
                <h4 className="news-title">{news.title}</h4>
                <p className="news-summary">{news.summary}</p>
                <div className="news-date">{formatDate(news.date)}</div>
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
                <button className="btn-view-all">View All News</button>
              </div>
              
              {newsItems.map((news) => (
                <div key={news.id} className="col-12 mb-4">
                  <div className="news-item-card">
                    <div className="row g-0">
                      <div className="col-md-8">
                        <div className="news-content">
                          <span className="news-category">{news.category}</span>
                          <h5 className="news-item-title">{news.title}</h5>
                          <p className="news-item-summary">{news.summary}</p>
                          <div className="news-item-date">{formatDate(news.date)}</div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="news-image-placeholder">
                          <i className="bi bi-newspaper"></i>
                        </div>
                      </div>
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
              
              {eventItems.map((event) => (
                <div key={event.id} className="event-card">
                  <div 
                    className="event-type-indicator"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="event-content">
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
                  </div>
                </div>
              ))}
              
              <button className="btn-view-all-events">View Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;