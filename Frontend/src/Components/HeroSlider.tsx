import { useState, useEffect } from 'react';

// Import your slider images
import slide1 from '../assets/images/slide1.jpg';
import slide2 from '../assets/images/slide2.jpg';
import slide3 from '../assets/images/slide3.jpg';
import slide4 from '../assets/images/slide4.jpg';

const HeroSlider = () => {
  const slides = [slide1, slide2, slide3, slide4];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="hero-slider">
      {/* Slides */}
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
      </div>

      {/* Slide Content Overlay */}
      <div className="slide-content">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Shaping Future Leaders of <span className="text-highlight">Bougainville</span>
                </h1>
                <p className="hero-subtitle">
                  Located in Buka, Bougainville - Providing quality education since 2013. 
                  A private institution dedicated to academic excellence and student success.
                </p>
                <div className="hero-buttons">
                  <a href="#apply" className="btn-hero-apply btn-hero-lg">
                    <span className="btn-hero-shine"></span>
                    <span className="btn-hero-text">Apply Now</span>
                    <span className="btn-hero-icon">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                    <span className="btn-hero-pulse"></span>
                  </a>
                  <a href="#about" className="btn-hero-learn btn-hero-lg">
                    <span className="btn-hero-text">Learn More</span>
                    <span className="btn-hero-icon">
                      <i className="bi bi-chevron-right"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="slider-arrow slider-arrow-prev" onClick={goToPrevSlide}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="slider-arrow slider-arrow-next" onClick={goToNextSlide}>
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;