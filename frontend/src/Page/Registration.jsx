// File: frontend/src/Page/Registration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/Registration.css';

const Registration = () => {
  const [email,setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegristration = async (e) => {
    e.preventDefault();
    //Checking if password are the same
    if(password !== confirmpassword)
    {
      alert('Passwords do not Match!')
      return 
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/registration.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data); // Log response data for debugging
  
      if (data.success) {
        navigate('/');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while trying to registr.');
    }
  };
  

  return (
    <div className='RegisterContainer'>
    <div className="Register_box">
    <div className="Register_Title">
      <h1>Wealth Wise</h1>
    </div>
    <form className="Register_section" onSubmit={handleRegristration}>
      <div className="email_section">
        <label htmlFor="username" className="email_text">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="username_section">
        <label htmlFor="username" className="username_text">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <p className= "pass_requir_txt">Password must contain at least 8 characters 1
        uppercase letter,1 number, 1 special character.
      </p>
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
      </div>
      <div className="confirm_password_section">
        <label htmlFor="password" className="password_text">Confirm Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
          title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
        />
      </div>
      <button type="submit" className="Register_in_box">
        <h2>Register</h2>
      </button>
      <div className="Log_in">
        Already have an account? <a href="#" class="create_or_login">Log in</a>
      </div>
    </form>
  </div>
  </div>
);
};

export default Registration;