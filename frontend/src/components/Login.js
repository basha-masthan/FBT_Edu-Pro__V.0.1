import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../App';

const styles = `
  .login-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .neuron {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #00ff88, #00ccff);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
    box-shadow: 0 0 20px #00ff88, 0 0 40px #00ccff;
  }

  .neuron-1 {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .neuron-2 {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  .neuron-3 {
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
  }

  .dna-strand {
    position: absolute;
    top: 10%;
    right: 10%;
    width: 4px;
    height: 80%;
    background: linear-gradient(to bottom, transparent, #ff6b6b, #4ecdc4, transparent);
    animation: rotate 10s linear infinite;
    transform-origin: center;
  }

  .dna-strand::before,
  .dna-strand::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #ff6b6b, #4ecdc4, transparent);
    animation: rotate 10s linear infinite reverse;
  }

  .dna-strand::before {
    left: -10px;
    transform: rotateZ(45deg);
  }

  .dna-strand::after {
    right: -10px;
    transform: rotateZ(-45deg);
  }

  .login-form {
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: glow 3s ease-in-out infinite alternate;
  }

  .form-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-title {
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(45deg, #00ff88, #00ccff, #ff6b6b);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
    animation: textGlow 2s ease-in-out infinite alternate;
  }

  .login-subtitle {
    color: #a0a0a0;
    font-size: 1.1rem;
    animation: fadeInUp 1s ease-out;
  }

  .form-group {
    margin-bottom: 25px;
  }

  .form-label {
    display: block;
    color: #00ff88;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .form-input {
    width: 100%;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
  }

  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .form-input:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  .login-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(45deg, #00ff88, #00ccff);
    border: none;
    border-radius: 10px;
    color: #0c0c0c;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
  }

  .btn-text {
    position: relative;
    z-index: 1;
  }

  .btn-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 1.5s infinite;
  }

  .error-message {
    color: #ff6b6b;
    text-align: center;
    margin-top: 15px;
    font-weight: 600;
  }

  .register-link {
    text-align: center;
    margin-top: 25px;
    color: #a0a0a0;
  }

  .register-link-text {
    color: #00ccff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .register-link-text:hover {
    color: #00ff88;
    text-shadow: 0 0 10px #00ff88;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes glow {
    0% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
    100% { box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2), 0 0 60px rgba(0, 204, 255, 0.1); }
  }

  @keyframes textGlow {
    0% { filter: brightness(1); }
    100% { filter: brightness(1.2); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { width: 0; height: 0; opacity: 1; }
    100% { width: 300px; height: 300px; opacity: 0; }
  }
`;

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login(formData);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-container">
      <div className="animated-bg">
        <div className="neuron neuron-1"></div>
        <div className="neuron neuron-2"></div>
        <div className="neuron neuron-3"></div>
        <div className="dna-strand"></div>
      </div>
      <div className="login-form">
        <div className="form-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="login-btn"
          >
            <span className="btn-text">Sign In</span>
            <div className="btn-pulse"></div>
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="register-link">
          Don't have an account? <a href="/register" className="register-link-text">Sign Up</a>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;