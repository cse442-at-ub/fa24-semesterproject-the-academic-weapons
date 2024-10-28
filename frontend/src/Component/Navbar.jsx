import React from 'react';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg'
import {Link, useLocation, useNavigate} from "react-router-dom";

const Navbar = ({username, openModal, openSettings, pfpMap, pfp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = sessionStorage.getItem("User")

    const logout = () => {
        sessionStorage.clear()
        navigate("/")
        window.location.reload()
    }

     if (!userID) {
        return null;
     }

    return (
        <nav className="navbar">
            <div className={"navbar_container"}>
            <div onClick={e => navigate('/')} className="navbar-logo">
                <img src={logo} alt="Wealth Wise Logo" className="logo-image"/>
                <span className="logo-text">
                Wealth <br/> Wise
                </span>
            </div>
            {/* <div className="navbar-links">
                 was told redunant and the logo brings us back so no reason for it <Link to={"/"}>Dashboard</Link> 
                <div onClick={openModal}>Add Transaction</div>
            </div> 
            AFTER further looking it kinda off to have transaction on the top if the point
            is to see the graphs and if they wish to add something then we should just 
            create add transaction onto a seperate box or existing one that makes sense
            this case no graphs 
            */}
            <div className="navbar-profile">
                <div onClick={openSettings} className={"navbar_name_icon_group"}>
                    <div className={"navbar_name"}>{username}</div>
                    <img src={pfpMap[pfp]} alt="Profile Icon" className="profile-icon"/>
                </div>
                <div onClick={logout} className="logout_text">Log Out</div>
            </div>
            </div>
        </nav>
    );
}

export default Navbar;
