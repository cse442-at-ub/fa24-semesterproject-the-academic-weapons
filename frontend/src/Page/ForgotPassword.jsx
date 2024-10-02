import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/ForgotPassword.css';
import TitleBanner from '../Component/TitleBanner.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate email format
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Send request to your server (replace with your actual API endpoint)
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/forgot-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        setMessage('Password recovery link has been sent to your email.');
        // Redirect to reset-password page if successful
        setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while trying to send the recovery email.');
    }
  };

  return (
    <div className="forgot-password-container">
      <TitleBanner />
      <div className="forgot-password-box">
        <div className="forgot-password-title">
          <h2>Forgot Password</h2>
          <p>Enter your account email to receive a password recovery link.</p>
        </div>
        <form onSubmit={handleForgotPassword}>
          <div className="email-section">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="send-code-button">Send Code</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
