import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsAPI, eventsAPI } from '../../services/api';
import '../Admin/css/dashbaord.css';
import type { NewsItem, EventItem } from '../../types';
import exitSvg from '../../assets/exit.svg'; 
import exitGif from '../../assets/exit.gif';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // state variable to track when the logout animation is playing
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // states for modals and toasts
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'news' | 'event', id: string, title: string } | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; type: 'success' | 'error'; message: string }>>([]);

  // Form states
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    title: '',
    summary: '',
    category: 'Announcements',
    isFeatured: false,
    status: 'published'
  });
  
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'event',
    status: 'upcoming'
  });

  // Image states
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string>('');
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Validation states
  const [newsErrors, setNewsErrors] = useState<{[key: string]: string}>({});
  const [eventErrors, setEventErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (activeTab === 'news') {
      loadNews();
    } else if (activeTab === 'events') {
      loadEvents();
    }
  }, [activeTab]);
  
  // Debug code
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Admin Token:', token);
    console.log('Token length:', token?.length);
    
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Validation functions
  const validateNewsForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!newsForm.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!newsForm.summary?.trim()) {
      errors.summary = 'Summary is required';
    }
    
    if (!newsForm.category?.trim()) {
      errors.category = 'Category is required';
    }

    setNewsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEventForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!eventForm.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!eventForm.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!eventForm.date?.trim()) {
      errors.date = 'Date is required';
    }
    
    if (!eventForm.time?.trim()) {
      errors.time = 'Time is required';
    }
    
    if (!eventForm.location?.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!eventForm.type?.trim()) {
      errors.type = 'Type is required';
    }

    setEventErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Image validation function
  const validateImage = (file: File | null): string => {
    if (!file) return ''; // Image is optional
    
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
      return 'Image size must be less than 50MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and GIF images are allowed';
    }
    
    return '';
  };

  // Input change handlers with validation
  const handleNewsInputChange = (field: string, value: string) => {
    setNewsForm({...newsForm, [field]: value});
    
    // Clear error when user starts typing
    if (newsErrors[field]) {
      setNewsErrors({...newsErrors, [field]: ''});
    }
  };

  const handleEventInputChange = (field: string, value: string) => {
    setEventForm({...eventForm, [field]: value});
    
    // Clear error when user starts typing
    if (eventErrors[field]) {
      setEventErrors({...eventErrors, [field]: ''});
    }
  };

  // Image handling functions
  const handleNewsImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        showToast('error', error);
        e.target.value = ''; // Clear the file input
        return;
      }
      
      setNewsImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        showToast('error', error);
        e.target.value = ''; // Clear the file input
        return;
      }
      
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearNewsImage = () => {
    setNewsImage(null);
    setNewsImagePreview('');
  };

  const clearEventImage = () => {
    setEventImage(null);
    setEventImagePreview('');
  };

  // Floating label handlers
  const handleNewsFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.classList.add('focused');
  };

  const handleNewsBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!e.target.value) {
      e.target.classList.remove('focused');
    }
  };

  const handleEventFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.classList.add('focused');
  };

  const handleEventBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!e.target.value) {
      e.target.classList.remove('focused');
    }
  };

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getAll();
      setNews(response.news);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Error loading news');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsAPI.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Error loading events');
    } finally {
      setLoading(false);
    }
  };

 const handleLogout = () => {
  // Start the animation
  setIsLoggingOut(true);
  
  // Wait for animation to complete before actual logout
  setTimeout(() => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }, 3000); 
};

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateNewsForm()) {
      showToast('error', 'Please fix the validation errors');
      return;
    }
    
    // Validate image if present
    if (newsImage) {
      const imageError = validateImage(newsImage);
      if (imageError) {
        showToast('error', imageError);
        return;
      }
    }

    try {
      const formData = new FormData();
      
      // Append all news data
      Object.keys(newsForm).forEach(key => {
        if (newsForm[key as keyof NewsItem] !== undefined) {
          formData.append(key, String(newsForm[key as keyof NewsItem]));
        }
      });
      
      // Append image if exists
      if (newsImage) {
        formData.append('image', newsImage);
      }
      
      const response = await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create news');
      }
      
      const savedNews = await response.json();
      
      // Reset form
      setNewsForm({
        title: '',
        summary: '',
        category: 'Announcements',
        isFeatured: false,
        status: 'published'
      });
      clearNewsImage();
      setNewsErrors({});
      
      loadNews();
      showToast('success', 'News created successfully!');
    } catch (error) {
      console.error('Error creating news:', error);
      showToast('error', 'Error creating news: ' + (error as Error).message);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateEventForm()) {
      showToast('error', 'Please fix the validation errors');
      return;
    }
    
    // Validate image if present
    if (eventImage) {
      const imageError = validateImage(eventImage);
      if (imageError) {
        showToast('error', imageError);
        return;
      }
    }

    try {
      const formData = new FormData();
      
      // Append all event data
      Object.keys(eventForm).forEach(key => {
        if (eventForm[key as keyof EventItem] !== undefined) {
          formData.append(key, String(eventForm[key as keyof EventItem]));
        }
      });
      
      // Append image if exists
      if (eventImage) {
        formData.append('image', eventImage);
      }
      
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
      
      const savedEvent = await response.json();
      
      // Reset form
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'event',
        status: 'upcoming'
      });
      clearEventImage();
      setEventErrors({});
      
      loadEvents();
      showToast('success', 'Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      showToast('error', 'Error creating event: ' + (error as Error).message);
    }
  };

  // Edit news
  const handleEditNews = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      summary: newsItem.summary,
      category: newsItem.category,
      isFeatured: newsItem.isFeatured,
      status: newsItem.status
    });
    setNewsErrors({});
    // Set active tab to news if not already
    setActiveTab('news');
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    // Validate form
    if (!validateNewsForm()) {
      showToast('error', 'Please fix the validation errors');
      return;
    }

    try {
      const formData = new FormData();
      
      // Append all news data
      Object.keys(newsForm).forEach(key => {
        if (newsForm[key as keyof NewsItem] !== undefined) {
          formData.append(key, String(newsForm[key as keyof NewsItem]));
        }
      });
      
      const response = await fetch(`http://localhost:5000/api/news/${editingNews._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update news');
      }
      
      // Reset form and editing state
      setEditingNews(null);
      setNewsForm({
        title: '',
        summary: '',
        category: 'Announcements',
        isFeatured: false,
        status: 'published'
      });
      setNewsErrors({});
      
      loadNews();
      showToast('success', 'News updated successfully!');
    } catch (error) {
      console.error('Error updating news:', error);
      showToast('error', 'Error updating news: ' + (error as Error).message);
    }
  };

  const cancelEditNews = () => {
    setEditingNews(null);
    setNewsForm({
      title: '',
      summary: '',
      category: 'Announcements',
      isFeatured: false,
      status: 'published'
    });
    setNewsErrors({});
    clearNewsImage();
  };

  // Edit events
  const handleEditEvent = (eventItem: EventItem) => {
    setEditingEvent(eventItem);
    setEventForm({
      title: eventItem.title,
      description: eventItem.description,
      date: eventItem.date.split('T')[0], // Format date for input
      time: eventItem.time,
      location: eventItem.location,
      type: eventItem.type,
      status: eventItem.status
    });
    setEventErrors({});
    // Set active tab to events if not already
    setActiveTab('events');
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // Validate form
    if (!validateEventForm()) {
      showToast('error', 'Please fix the validation errors');
      return;
    }

    try {
      const formData = new FormData();
      
      // Append all event data
      Object.keys(eventForm).forEach(key => {
        if (eventForm[key as keyof EventItem] !== undefined) {
          formData.append(key, String(eventForm[key as keyof EventItem]));
        }
      });
      
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }
      
      // Reset form and editing state
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'event',
        status: 'upcoming'
      });
      setEventErrors({});
      
      loadEvents();
      showToast('success', 'Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('error', 'Error updating event: ' + (error as Error).message);
    }
  };

  const cancelEditEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'event',
      status: 'upcoming'
    });
    setEventErrors({});
    clearEventImage();
  };

  // Toast functions
  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // Modal functions
  const confirmDelete = (type: 'news' | 'event', id: string, title: string) => {
    setItemToDelete({ type, id, title });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'news') {
        await newsAPI.delete(itemToDelete.id);
        loadNews();
        showToast('success', 'News deleted successfully!');
      } else {
        await eventsAPI.delete(itemToDelete.id);
        loadEvents();
        showToast('success', 'Event deleted successfully!');
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      showToast('error', `Error deleting ${itemToDelete.type}`);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        {/* Admin Header */}
        <div className="row p-3 admin-dashboard-header">
          <div className="col">
            <h4>
              <i className="bi bi-speedometer2"></i>
              Admin Dashboard
            </h4>
          </div>
            <div className="col-auto">
            <button 
              className={`btn-logout ${isLoggingOut ? 'logging-out' : ''}`}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <img 
                    src={exitGif} 
                    alt="Logging out..." 
                    className="admin-logout-icon admin-logout-icon-animated" 
                  />
                  Logging out...
                </>
              ) : (
                <>
                  <div className="admin-logout-icon admin-logout-icon-static"></div>
                  Logout
                </>
              )}
            </button>
          </div>
        </div>

        <div className="row mt-3 admin-overview-row3">
          <div className="col-md-3">
            <div className="list-group">
              <button className={`list-group-item list-group-item-action ${activeTab === 'overview' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('overview')}>
                <i className="bi bi-house-door"></i>
                Overview
              </button>
              <button className={`list-group-item list-group-item-action ${activeTab === 'news' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('news')}>
                <i className="bi bi-newspaper"></i>
                Manage News
              </button>
              <button className={`list-group-item list-group-item-action ${activeTab === 'events' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('events')}>
                <i className="bi bi-calendar-event"></i>
                Manage Events
              </button>
            </div>
          </div>

          <div className="col-md-9 admin-overview-row9">
            {activeTab === 'overview' && (
              <div>
                <h5>Welcome to Admin Panel</h5>
                <p>Manage your website content from here.</p>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <i className="bi bi-newspaper display-4 text-primary mb-3"></i>
                        <h5 className="card-title">News</h5>
                        <p className="card-text">Create and manage news articles</p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => setActiveTab('news')}
                        >
                          <i className="bi bi-plus-circle"></i>
                          Manage News
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <i className="bi bi-calendar-event display-4 text-success mb-3"></i>
                        <h5 className="card-title">Events</h5>
                        <p className="card-text">Create and manage events</p>
                        <button 
                          className="btn btn-success"
                          onClick={() => setActiveTab('events')}
                        >
                          <i className="bi bi-plus-circle"></i>
                          Manage Events
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <h5>
                  <i className="bi bi-newspaper me-2"></i>
                  News Management
                </h5>
                
                {/* Create/Edit News Form */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-plus-circle me-2"></i>
                      {editingNews ? 'Edit News' : 'Create New News'}
                    </h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews}>
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${newsErrors.title ? 'is-invalid' : ''}`}
                          value={newsForm.title}
                          onChange={(e) => handleNewsInputChange('title', e.target.value)}
                          onFocus={handleNewsFocus}
                          onBlur={handleNewsBlur}
                          placeholder=" "
                        />
                        <label className="form-label">Title</label>
                        {newsErrors.title && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {newsErrors.title}
                          </div>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <textarea
                          className={`form-control ${newsErrors.summary ? 'is-invalid' : ''}`}
                          value={newsForm.summary}
                          onChange={(e) => handleNewsInputChange('summary', e.target.value)}
                          onFocus={handleNewsFocus}
                          onBlur={handleNewsBlur}
                          placeholder=" "
                          rows={4}
                        />
                        <label className="form-label">Summary</label>
                        {newsErrors.summary && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {newsErrors.summary}
                          </div>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <select
                          className={`form-control ${newsErrors.category ? 'is-invalid' : ''}`}
                          value={newsForm.category}
                          onChange={(e) => handleNewsInputChange('category', e.target.value)}
                          onFocus={handleNewsFocus}
                          onBlur={handleNewsBlur}
                        >
                          <option value="Announcements">Announcements</option>
                          <option value="Achievements">Achievements</option>
                          <option value="Events">Events</option>
                          <option value="Facilities">Facilities</option>
                          <option value="Admissions">Admissions</option>
                        </select>
                        <label className="form-label">Category</label>
                        {newsErrors.category && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {newsErrors.category}
                          </div>
                        )}
                      </div>
                      
                      {/* Image Upload for News - Only show when creating new news */}
                      {!editingNews && (
                        <div className="mb-3">
                          <label className="fw-bold mb-2">News Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleNewsImageChange}
                          />
                          <small className="form-text text-muted">
                            Supported formats: JPG, PNG, GIF. Max size: 50MB
                          </small>
                          {newsImagePreview && (
                            <div className="mt-2">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={newsImagePreview} 
                                  alt="Preview" 
                                  style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px',
                                    objectFit: 'cover'
                                  }}
                                  className="img-thumbnail me-3"
                                />
                                <button 
                                  type="button" 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={clearNewsImage}
                                >
                                  <i className="bi bi-trash"></i>
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={newsForm.isFeatured}
                          onChange={(e) => setNewsForm({...newsForm, isFeatured: e.target.checked})}
                        />
                        <label className="form-check-label">Featured News</label>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                          <i className={editingNews ? "bi bi-check-circle" : "bi bi-plus-circle"}></i>
                          {editingNews ? 'Update News' : 'Create News'}
                        </button>
                        {editingNews && (
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={cancelEditNews}
                          >
                            <i className="bi bi-x-circle"></i>
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* News List */}
                <h6>
                  <i className="bi bi-list-ul me-2"></i>
                  Existing News
                </h6>
                {loading ? (
                  <div className="loading-text">
                    <i className="bi bi-arrow-repeat spinner me-2"></i>
                    Loading news...
                  </div>
                ) : (
                  <div className="list-group">
                    {news.map((item) => (
                      <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {item.imageUrl && (
                            <img 
                              src={`http://localhost:5000${item.imageUrl}`}
                              alt={item.title}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginRight: '15px'
                              }}
                            />
                          )}
                          <div>
                            <h6 className="mb-1">{item.title}</h6>
                            <small className="text-muted">{item.category} • {new Date(item.date).toLocaleDateString()}</small>
                            {item.isFeatured && (
                              <span className="badge bg-warning ms-2">
                                <i className="bi bi-star-fill me-1"></i>
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditNews(item)}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmDelete('news', item._id!, item.title)}
                          >
                            <i className="bi bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h5>
                  <i className="bi bi-calendar-event me-2"></i>
                  Events Management
                </h5>
                
                {/* Create/Edit Event Form */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-plus-circle me-2"></i>
                      {editingEvent ? 'Edit Event' : 'Create New Event'}
                    </h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}>
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${eventErrors.title ? 'is-invalid' : ''}`}
                          value={eventForm.title}
                          onChange={(e) => handleEventInputChange('title', e.target.value)}
                          onFocus={handleEventFocus}
                          onBlur={handleEventBlur}
                          placeholder=" "
                        />
                        <label className="form-label">Title</label>
                        {eventErrors.title && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {eventErrors.title}
                          </div>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <textarea
                          className={`form-control ${eventErrors.description ? 'is-invalid' : ''}`}
                          value={eventForm.description}
                          onChange={(e) => handleEventInputChange('description', e.target.value)}
                          onFocus={handleEventFocus}
                          onBlur={handleEventBlur}
                          placeholder=" "
                          rows={4}
                        />
                        <label className="form-label">Description</label>
                        {eventErrors.description && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {eventErrors.description}
                          </div>
                        )}
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="date"
                              className={`form-control ${eventErrors.date ? 'is-invalid' : ''}`}
                              value={eventForm.date}
                              onChange={(e) => handleEventInputChange('date', e.target.value)}
                              onFocus={handleEventFocus}
                              onBlur={handleEventBlur}
                              placeholder=" "
                            />
                            <label className="form-label">Date</label>
                            {eventErrors.date && (
                              <div className="invalid-feedback d-block">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {eventErrors.date}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className={`form-control ${eventErrors.time ? 'is-invalid' : ''}`}
                              value={eventForm.time}
                              onChange={(e) => handleEventInputChange('time', e.target.value)}
                              onFocus={handleEventFocus}
                              onBlur={handleEventBlur}
                              placeholder=" "
                            />
                            <label className="form-label">Time (e.g., 9:00 AM - 3:00 PM)</label>
                            {eventErrors.time && (
                              <div className="invalid-feedback d-block">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {eventErrors.time}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${eventErrors.location ? 'is-invalid' : ''}`}
                          value={eventForm.location}
                          onChange={(e) => handleEventInputChange('location', e.target.value)}
                          onFocus={handleEventFocus}
                          onBlur={handleEventBlur}
                          placeholder=" "
                        />
                        <label className="form-label">Location</label>
                        {eventErrors.location && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {eventErrors.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <select
                          className={`form-control ${eventErrors.type ? 'is-invalid' : ''}`}
                          value={eventForm.type}
                          onChange={(e) => handleEventInputChange('type', e.target.value)}
                          onFocus={handleEventFocus}
                          onBlur={handleEventBlur}
                        >
                          <option value="event">Event</option>
                          <option value="academic">Academic</option>
                          <option value="sports">Sports</option>
                          <option value="cultural">Cultural</option>
                        </select>
                        <label className="form-label">Type</label>
                        {eventErrors.type && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {eventErrors.type}
                          </div>
                        )}
                      </div>
                      
                      {/* Image Upload for Events - Only show when creating new event */}
                      {!editingEvent && (
                        <div className="mb-3">
                          <label className="fw-bold mb-2">Event Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleEventImageChange}
                          />
                          <small className="form-text text-muted">
                            Supported formats: JPG, PNG, GIF. Max size: 50MB
                          </small>
                          {eventImagePreview && (
                            <div className="mt-2">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={eventImagePreview} 
                                  alt="Preview" 
                                  style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px',
                                    objectFit: 'cover'
                                  }}
                                  className="img-thumbnail me-3"
                                />
                                <button 
                                  type="button" 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={clearEventImage}
                                >
                                  <i className="bi bi-trash"></i>
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                          <i className={editingEvent ? "bi bi-check-circle" : "bi bi-plus-circle"}></i>
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                        {editingEvent && (
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={cancelEditEvent}
                          >
                            <i className="bi bi-x-circle"></i>
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Events List */}
                <h6>
                  <i className="bi bi-list-ul me-2"></i>
                  Existing Events
                </h6>
                {loading ? (
                  <div className="loading-text">
                    <i className="bi bi-arrow-repeat spinner me-2"></i>
                    Loading events...
                  </div>
                ) : (
                  <div className="list-group">
                    {events.map((event) => (
                      <div key={event._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {event.imageUrl && (
                            <img 
                              src={`http://localhost:5000${event.imageUrl}`}
                              alt={event.title}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginRight: '15px'
                              }}
                            />
                          )}
                          <div>
                            <h6 className="mb-1">{event.title}</h6>
                            <small className="text-muted">{event.type} • {new Date(event.date).toLocaleDateString()} • {event.location}</small>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmDelete('event', event._id!, event.title)}
                          >
                            <i className="bi bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this {itemToDelete.type}:</p>
                <p className="fw-bold">"{itemToDelete.title}"?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white bg-${toast.type === 'success' ? 'success' : 'danger'} border-0`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;