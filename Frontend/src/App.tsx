import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HeroSlider from './Components/HeroSlider';
import NewsEvents from './Components/NewsEvents';
import AllNewsPage from './Components/AllNewsPage';
import EventsCalendarPage from './Components/EventsCalendarPage';
import About from './Pages/About';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ProtectedRoute from './Components/Admin/ProtectedRoute';
import './App.css';
import Admissions from './Components/Admissions';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <>
            <section id="home">
              
              <HeroSlider />
            </section>
            {/*News and events*/}
            <NewsEvents/>
            <FeaturesSection />
            <StatsSection />
          </>
        } />

        {/* About Route */}
        <Route path="/about" element={<About />} />
         <Route path="/admissions" element={<Admissions />} />

        {/* All news & Events calendar Routes */}
      <Route path="/news" element={<AllNewsPage />} />
      <Route path="/events" element={<EventsCalendarPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}


// Features Section
const FeaturesSection: React.FC = () => (
  <section id="about" className="features-section py-5">
    <div className="container">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h2 className="section-title">Why Choose Eastern Pacific Academy?</h2>
          <p className="section-subtitle">Excellence in education for over 12 years</p>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <div className="feature-card">
            <div className="feature-icon academic-icon">
              <i className="bi bi-award"></i>
            </div>
            <h4>Academic Excellence</h4>
            <p>Consistently producing top-performing students who excel in national examinations and university placements.</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="feature-card">
            <div className="feature-icon university-icon">
              <i className="bi bi-mortarboard"></i>
            </div>
            <h4>University Preparation</h4>
            <p>Successful track record of sending graduates to prestigious universities across Papua New Guinea and beyond.</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="feature-card">
            <div className="feature-icon private-icon">
              <i className="bi bi-star"></i>
            </div>
            <h4>Private Institution</h4>
            <p>Independent curriculum focused on holistic student development, leadership, and critical thinking skills.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Stats Section
const StatsSection: React.FC = () => (
  <section className="stats-section py-5">
    <div className="container">
      <div className="row g-4 text-center">
        <div className="col-lg-4 col-md-6">
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Successful Graduates</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="stat-item">
            <h3 className="stat-number">95%</h3>
            <p className="stat-label">University Acceptance Rate</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="stat-item">
            <h3 className="stat-number">12+</h3>
            <p className="stat-label">Years of Excellence</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default App;