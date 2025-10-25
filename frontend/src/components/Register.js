import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../App';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.register(formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <>
      <style>{`
        .register-container {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .molecule {
          position: absolute;
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          animation: moleculeFloat 8s ease-in-out infinite;
          box-shadow: 0 0 30px #ff6b6b, 0 0 60px #4ecdc4;
        }

        .molecule-1 {
          top: 15%;
          left: 20%;
          animation-delay: 0s;
        }

        .molecule-2 {
          top: 70%;
          right: 10%;
          animation-delay: 3s;
        }

        .molecule-3 {
          bottom: 20%;
          left: 15%;
          animation-delay: 6s;
        }

        .brain-wave {
          position: absolute;
          top: 20%;
          right: 20%;
          width: 200px;
          height: 200px;
          border: 2px solid #00ccff;
          border-radius: 50%;
          animation: brainWave 5s linear infinite;
        }

        .brain-wave::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150px;
          height: 150px;
          border: 2px solid #00ff88;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: brainWave 5s linear infinite reverse;
        }

        .register-form {
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
          animation: registerGlow 4s ease-in-out infinite alternate;
        }

        .register-title {
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #00ccff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
          margin-bottom: 10px;
          animation: registerTextGlow 2.5s ease-in-out infinite alternate;
        }

        .register-subtitle {
          color: #a0a0a0;
          font-size: 1.1rem;
          text-align: center;
          animation: fadeInUp 1s ease-out;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          color: #4ecdc4;
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
          border-color: #4ecdc4;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        .register-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
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

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
        }

        .error-message {
          color: #ff6b6b;
          text-align: center;
          margin-top: 15px;
          font-weight: 600;
        }

        .login-link {
          text-align: center;
          margin-top: 25px;
          color: #a0a0a0;
        }

        .login-link-text {
          color: #00ccff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link-text:hover {
          color: #4ecdc4;
          text-shadow: 0 0 10px #4ecdc4;
        }

        @keyframes moleculeFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.2); }
        }

        @keyframes brainWave {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.1); }
        }

        @keyframes registerGlow {
          0% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
          100% { box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2), 0 0 60px rgba(255, 107, 107, 0.1); }
        }

        @keyframes registerTextGlow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="register-container">
        <div className="register-bg">
          <div className="molecule molecule-1"></div>
          <div className="molecule molecule-2"></div>
          <div className="molecule molecule-3"></div>
          <div className="brain-wave"></div>
        </div>
        <div className="register-form">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join our learning community</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
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
                placeholder="Create a strong password"
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <button
              type="submit"
              className="register-btn"
            >
              Sign Up
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="login-link">
            Already have an account? <a href="/login" className="login-link-text">Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;