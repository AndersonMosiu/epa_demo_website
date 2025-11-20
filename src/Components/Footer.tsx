

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="container">
        <div className="row">
          {/* School Information */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h4 className="footer-title">Eastern Pacific Academy</h4>
            <p className="footer-text">
              Buka, Bougainville<br />
              Papua New Guinea
            </p>
            <p className="footer-tagline">Private Institution • Est. 2013</p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-subtitle">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#academics">Academics</a></li>
              <li><a href="#admissions">Admissions</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-subtitle">Contact Us</h5>
            <div className="footer-contact">
              <p className="footer-text">
                <i className="bi bi-envelope me-2"></i>
                info@easternpacific.ac.pg
              </p>
              <p className="footer-text">
                <i className="bi bi-telephone me-2"></i>
                +675 89065789
              </p>
              <p className="footer-text">
                <i className="bi bi-geo-alt me-2"></i>
                Buka, Bougainville
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-subtitle">Follow Us</h5>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <hr className="footer-divider" />
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Eastern Pacific Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;