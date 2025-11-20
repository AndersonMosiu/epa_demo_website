// Components/Header.tsx
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top custom-navbar">
      <div className="container">
        {/* Logo and School Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="logo me-3">
            <img 
              src={logo} 
              alt="Eastern Pacific Academy Logo" 
              className="logo-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="logo-fallback" style={{display: 'none'}}>EPA</div>
          </div>
          <div className="school-info">
            <h1 className="school-name">Eastern Pacific Academy</h1>
            <p className="school-tagline">Learning To Serve</p>
          </div>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#academics">Academics</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#admissions">Admissions</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link btn-apply" href="#apply">Apply Now</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;