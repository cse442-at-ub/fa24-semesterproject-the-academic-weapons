// File: frontend/src/Page/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({username, password}),
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
        navigate('/');
        window.location.reload()
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while trying to log in.');
    }
  };


  return (
      <div className='LoginContainer'>
        <div className="Login_box">
          <div onClick={event => navigate('/')} className="Login_Title">
            <h1>Wealth Wise</h1>
          </div>
          <form className="login_section" onSubmit={handleLogin}>
            <div className="email_section">
              <label htmlFor="username" className="email_text">Email</label>
              <input
                  type="email"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
              />
              <a className="forgot_password" onClick={e => navigate('/forget-password')}>Forgot Password</a>
            </div>
            <button type="submit" className="log_in_box">
              <h2>Log in</h2>
            </button>
            <div className="Create_account">
              Don't have an account?
              <div
                  className="create_or_login"
                  onClick={() => navigate('/registration')}
              >
                Sign up
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;