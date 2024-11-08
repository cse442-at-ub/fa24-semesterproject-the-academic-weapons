// File: frontend/src/Page/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/Login.css';

const Login = ( { openError, setErrorMessage, } ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Log response data for debugging

      if (data.success) {
        sessionStorage.setItem('username', data.username)
        sessionStorage.setItem('pfp', data.pfp)
        sessionStorage.setItem("User", data.id)
        sessionStorage.setItem("auth_token", data.auth_token)
        setIsSuccess(true);
        setMessage('Login successful! Redirecting...');
         setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || 'Login failed');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while trying to log in.');
      setIsSuccess(false);
    }
  };


  return (
    <div className='LoginContainer'>
      <div className="Login_box">
        <div onClick={() => navigate('/')} className="Login_Title">
          <h1>Wealth Wise</h1>
        </div>
        <form className="login_section" onSubmit={handleLogin}>
          {message && (
                  <div
                    style={{
                      color: isSuccess ? 'green' : 'red', // Green for success, red for error
                      marginTop: '10px',
                      fontSize: '0.9em',
                      textAlign: 'center',
                    }}
                  >
                    {message}
                    </div>
                    )}
          <div className="email_section">
            <label htmlFor="email" className="email_text">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password_section">
            <label htmlFor="password" className="password_text">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a className="forgot_password" onClick={() => navigate('/forget-password')}>Forgot Password</a>
          </div>
          <button type="submit" className="log_in_box">
            <h2>Log in</h2>
          </button>
          <div className="Create_account">
            Don't have an account? <div className="create_or_login" onClick={() => navigate('/registration')}>Sign up</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;