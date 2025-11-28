import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './css/AdminLogin.css'; // Import the CSS file

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(username.trim(), password);
      if (response.token) {
        localStorage.setItem('adminToken', response.token);
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // SVG Eye icons for show/hide password
  const EyeIcon = () => (
    <svg className="admin-login-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="admin-login-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div className="admin-login-container">
      <div className="admin-login-card-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-card-header">
            <h4 className="admin-login-title">Admin Portal</h4>
            <p className="admin-login-subtitle">Secure Access Required</p>
          </div>
          <div className="admin-login-card-body">
            {error && (
              <div className="admin-login-error-alert" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="admin-login-form-group">
                <div className="admin-login-input-wrapper">
                  <input
                    id="admin-login-username"
                    type="text"
                    className={`admin-login-form-control ${!username && error ? 'admin-login-is-invalid' : ''}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="username"
                    placeholder=" "
                  />
                  <label htmlFor="admin-login-username" className="admin-login-form-label">
                    Username
                  </label>
                </div>
              </div>
              
              <div className="admin-login-form-group">
                <div className="admin-login-input-wrapper">
                  <input
                    id="admin-login-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`admin-login-form-control ${!password && error ? 'admin-login-is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    placeholder=" "
                  />
                  <label htmlFor="admin-login-password" className="admin-login-form-label">
                    Password
                  </label>
                  <button
                    type="button"
                    className="admin-login-password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="admin-login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="admin-login-spinner" aria-hidden="true"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>
            
            <div className="admin-login-security-note">
              <span className="admin-login-security-icon">🔒</span>
              Secure encrypted connection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;