import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
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

    // In a real app, you would send this to a backend
    // For now, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      setError('Username already exists');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === formData.email)) {
      setError('Email already exists');
      return;
    }

    // Add new user
    const newUser = {
      ...formData,
      id: Date.now() // Simple way to generate unique ID
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user
    login(newUser);
    navigate('/my-collection');
  };

  return (
    <div>
      <div className="sign-up-container">
        <h1>Plant Parenthood</h1>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h2>Sign Up!</h2>
          {error && <div className="error-message" style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
          <button type="submit">Continue</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}