import React from 'react';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg'
import {Link, useLocation, useNavigate} from "react-router-dom";

const Navbar = ({ openModal, openSettings }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname !== "/login" || location.pathname !== "/register" || location.pathname !== "/#login")
    {
      return null;
    }
      return (
    <nav className="navbar">
      <div onClick={e => navigate('/')} className="navbar-logo">
        <img src={logo} alt="Wealth Wise Logo" className="logo-image" />
        <span className="logo-text">
          Wealth <br /> Wise
        </span>
      </div>
      <div className="navbar-links">
        <Link to={"/"}>Dashboard</Link>
        <div onClick={openModal}>Add Transaction</div>
      </div>
      <div className="navbar-profile">
        <img onClick={openSettings} src={person1} alt="Profile Icon" className="profile-icon" />
        <div>Log Out</div>
      </div>
    </nav>
  );
}

export default Navbar;
