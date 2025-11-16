import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // In a real app, you would validate against a backend
    // For now, we'll simulate authentication with localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === formData.username && u.password === formData.password);

    if (user) {
      login(user);
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <div className="login-container">
        <h1>Plant Parenthood</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Your plant journey starts here. Log in to begin!</h2>
          {error && <div className="error-message" style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Log In</button>
          <p className="signup-text">
            Don't have an account? <a href="/signup" className="link">Sign Up</a>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}