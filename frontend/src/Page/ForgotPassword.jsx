import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/ForgotPassword.css';
import TitleBanner from '../Component/TitleBanner.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  if (!isValidEmail(email)) {
    setError('Please enter a valid email address.');
    setIsSuccess(false);
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/forgot-password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Check the status before reading the body
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Read the response body only once
    const data = await response.json();

    // Handle the success response
    if (data.success) {
      setMessage('Password recovery link has been sent to your email.');
      setIsSuccess(true);
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } else {
      setError(data.message || 'An error occurred. Please try again.');
      setIsSuccess(false);
    }
  } catch (error) {
    console.error('Error:', error);
    setError('An error occurred while trying to send the recovery email.');
    setIsSuccess(false);
  }
};



  return (
      <div className="forgot-password-container">
        {/*<TitleBanner />*/}
        <div onClick={event => navigate('/')} className="Login_Title">
          <h1>Wealth Wise</h1>
        </div>
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
             <div className="message-container">
              {error && (
                <div
                  style={{
                    color: 'red',
                    marginTop: '10px',
                    fontSize: '0.9em',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}
              {message && (
                <div
                  style={{
                    color: 'green',
                    marginTop: '10px',
                    fontSize: '0.9em',
                    textAlign: 'center',
                  }}
                >
                  {message}
                </div>
              )}
            </div>
            <button type="submit" className="send-code-button">Send Code</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
          </form>
        </div>
      </div>
  );
};

export default ForgotPassword;
