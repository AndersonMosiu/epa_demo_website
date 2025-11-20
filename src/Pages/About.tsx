// pages/About.tsx
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const About: React.FC = () => {
  return (
    <div className="App">
      <Header />
      
      <section className="about-section py-5">
        <div className="container">
          {/* Header Section */}
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">About Eastern Pacific Academy</h2>
              <p className="section-subtitle">Excellence in Education Since 2012</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="row mb-5">
            <div className="col-lg-6 mb-4">
              <div className="about-card mission-card">
                <div className="about-icon">
                  <i className="bi bi-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To provide a transformative educational experience that empowers students to 
                  achieve academic excellence, develop strong moral character, and become 
                  responsible global citizens who are prepared to serve their communities 
                  and make positive contributions to society.
                </p>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="about-card vision-card">
                <div className="about-icon">
                  <i className="bi bi-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To be Papua New Guinea's leading private educational institution, 
                  recognized for nurturing innovative thinkers, ethical leaders, and 
                  lifelong learners who drive positive change in their communities 
                  and the world at large.
                </p>
              </div>
            </div>
          </div>

          {/* School History */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="history-section">
                <h3 className="text-center mb-4" style={{ color: 'var(--primary-dark)' }}>Our Story</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-year">2012</div>
                    <div className="timeline-content">
                      <h5>Foundation Established</h5>
                      <p>Eastern Pacific Academy was founded with a vision to provide quality education that combines academic excellence with character development.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-year">2015</div>
                    <div className="timeline-content">
                      <h5>First Graduating Class</h5>
                      <p>Our first batch of students graduated with outstanding results, marking the beginning of our legacy of academic success.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-year">2018</div>
                    <div className="timeline-content">
                      <h5>Campus Expansion</h5>
                      <p>We expanded our facilities to include modern science laboratories, computer labs, and a comprehensive library.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-year">2024</div>
                    <div className="timeline-content">
                      <h5>Continued Excellence</h5>
                      <p>Over 500 successful graduates and maintaining a 95% university acceptance rate for our students.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="row mb-5">
            <div className="col-12 text-center mb-4">
              <h3 style={{ color: 'var(--primary-dark)' }}>Our Core Values</h3>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="value-card">
                <div className="value-icon integrity-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5>Integrity</h5>
                <p>We uphold the highest standards of honesty, ethics, and moral principles in all our actions.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="value-card">
                <div className="value-icon excellence-icon">
                  <i className="bi bi-star"></i>
                </div>
                <h5>Excellence</h5>
                <p>We strive for the highest quality in teaching, learning, and all aspects of school life.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="value-card">
                <div className="value-icon community-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h5>Community</h5>
                <p>We foster a supportive environment where everyone feels valued and connected.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="value-card">
                <div className="value-icon innovation-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <h5>Innovation</h5>
                <p>We embrace creativity and new ideas to enhance learning and personal growth.</p>
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h3 style={{ color: 'var(--primary-dark)' }}>Leadership Team</h3>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-card">
                <div className="team-image">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="team-info">
                  <h5>Dr. Sarah Johnson</h5>
                  <p className="team-role">Principal</p>
                  <p className="team-bio">
                    With over 20 years of educational leadership experience, Dr. Johnson is committed to academic excellence and student development.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-card">
                <div className="team-image">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="team-info">
                  <h5>Mr. David Chen</h5>
                  <p className="team-role">Vice Principal</p>
                  <p className="team-bio">
                    Specializing in curriculum development and student affairs, Mr. Chen ensures our programs meet the highest standards.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-card">
                <div className="team-image">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="team-info">
                  <h5>Ms. Maria Rodriguez</h5>
                  <p className="team-role">Academic Dean</p>
                  <p className="team-bio">
                    Leading our faculty in delivering innovative teaching methods and maintaining academic rigor across all departments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;