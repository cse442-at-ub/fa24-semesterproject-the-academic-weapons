import React from 'react';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg'
import {Link, useLocation, useNavigate} from "react-router-dom";

const Navbar = ({ openModal, openSettings, pfpMap, pfp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = sessionStorage.getItem("User")

    const logout = () => {
        sessionStorage.removeItem("User")
        navigate("/")
        window.location.reload()
    }

    if (!userID) {
        return null;
    }

    return (
        <nav className="navbar">
            <div onClick={e => navigate('/')} className="navbar-logo">
                <img src={logo} alt="Wealth Wise Logo" className="logo-image"/>
                <span className="logo-text">
          Wealth <br/> Wise
        </span>
            </div>
            <div className="navbar-links">
                <Link to={"/"}>Dashboard</Link>
                <div onClick={openModal}>Add Transaction</div>
            </div>
            <div className="navbar-profile">
                <img onClick={openSettings} src={pfpMap[pfp]} alt="Profile Icon" className="profile-icon"/>
                <div className="navbar-Logout" onClick={logout}>Log Out</div>
            </div>
        </nav>
    );
}

export default Navbar;
