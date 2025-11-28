import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import type { EventItem } from '../types';
import './css/EventsCalendarPage.css';

const EventsCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    try {
      const eventsData = await eventsAPI.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (event: EventItem): string | null => {
    if (event.imageUrl) {
      if (event.imageUrl.startsWith('http')) {
        return event.imageUrl;
      }
      return `http://localhost:5000${event.imageUrl}`;
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
      <div className="events-calendar-page">
        <div className="events-calendar-container">
          <div className="events-calendar-loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-calendar-page">
      <div className="events-calendar-container">
        <div className="events-calendar-header">
          <h1 className="events-calendar-title">Events Calendar</h1>
          <p className="events-calendar-subtitle">
            All upcoming events at Eastern Pacific Academy
          </p>
        </div>
        
        <div className="events-calendar-list">
          {events.map((event) => (
            <div key={event._id || event.id} className="event-calendar-card">
              <div className="event-calendar-content">
                {/* Event Image */}
                {getImageUrl(event) && (
                  <div className="event-calendar-image">
                    <img 
                      src={getImageUrl(event)!} 
                      alt={event.title}
                    />
                    <div className="event-calendar-overlay"></div>
                  </div>
                )}
                
                {/* Event Details */}
                <div className="event-calendar-details">
                  <div className="event-calendar-header">
                    <div className="event-type-indicator" data-type={event.type}></div>
                    <div className="event-calendar-info">
                      <div className="event-calendar-meta">
                        <span className={`event-type-badge event-type-${event.type}`}>
                          {event.type}
                        </span>
                        <div className="event-date-badge">
                          <i className="bi bi-calendar-event"></i>
                          {formatDate(event.date)}
                        </div>
                      </div>
                      <h3 className="event-calendar-title">{event.title}</h3>
                      <p className="event-calendar-description">{event.description}</p>
                      
                      <div className="event-calendar-meta-details">
                        <div className="event-meta-item">
                          <i className="bi bi-clock"></i>
                          <span className="event-meta-label">Time:</span>
                          <span className="event-meta-value">{event.time}</span>
                        </div>
                        <div className="event-meta-item">
                          <i className="bi bi-geo-alt"></i>
                          <span className="event-meta-label">Location:</span>
                          <span className="event-meta-value">{event.location}</span>
                        </div>
                        {event.audience && event.audience !== 'all' && (
                          <div className="event-meta-item">
                            <i className="bi bi-people"></i>
                            <span className="event-meta-label">Audience:</span>
                            <span className="event-meta-value">{event.audience}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="events-calendar-empty">
            <i className="bi bi-calendar-x"></i>
            <h3>No Upcoming Events</h3>
            <p>Check back later for upcoming events at Eastern Pacific Academy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCalendarPage;