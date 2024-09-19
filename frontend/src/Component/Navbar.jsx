import React from 'react';
import '../CSS Files/Navbar.css'; 
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Wealth Wise Logo" className="logo-image" />
        <span className="logo-text">
          Wealth <br /> Wise
        </span>
      </div>
      <div className="navbar-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/add-transaction">Add Transaction</a>
      </div>
      <div className="navbar-profile">
        <img src={person1} alt="Profile Icon" className="profile-icon" />
        <a href="/logout">Log Out</a>
      </div>
    </nav>
  );
}

export default Navbar;
