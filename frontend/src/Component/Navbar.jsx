import React, { useState } from 'react';
import { FaPiggyBank, FaEdit } from 'react-icons/fa';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ username, openSettings, pfpMap, pfp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = sessionStorage.getItem("User");

    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode
    const [currentSavings, setCurrentSavings] = useState(400); // Example current savings
    const [savingsGoal, setSavingsGoal] = useState(1000); // Example goal

    const logout = () => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
    };

    const toggleSavingsModal = () => {
        setShowSavingsModal(!showSavingsModal);
    };

    const toggleEditGoal = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    const handleSave = () => {
        setIsEditing(false); // Exit edit mode after saving
        // Optionally, here you can add logic to save to the backend
    };

    // Function to calculate the progress percentage and color
    const progressPercentage = Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100);
    const getGreenShade = () => {
        const greenValue = Math.min(Math.round(progressPercentage * 2.55), 255); // Max is 255 for full green
        return `rgb(0, ${greenValue}, 0)`; // More green as progress increases
    };

    if (!userID) {
        return null;
    }

    return (
        <nav className="navbar">
            <div onClick={() => navigate('/')} className="navbar-logo">
                <img src={logo} alt="Wealth Wise Logo" className="logo-image" />
                <span className="logo-text">Wealth <br /> Wise</span>
            </div>

            <div className="navbar-profile">
                <div className="navbar_name_icon_group" onClick={openSettings}>
                    <div className="navbar_name">{username}</div>
                    <img src={pfpMap[pfp]} alt="Profile Icon" className="profile-icon" />
                </div>
                <div className="navbar-savings-container">
                    <FaPiggyBank className="savings-icon" onClick={toggleSavingsModal} style={{ fontSize: '2rem' }} />
                    <div className="mini-progress-bar-container">
                        <div
                            className="mini-progress-bar"
                            style={{ width: `${progressPercentage}%`, backgroundColor: getGreenShade() }}
                        />
                    </div>
                </div>
                <div className="logout_text" onClick={logout}>Log Out</div>
            </div>

            {showSavingsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={toggleSavingsModal}>Close</button>
                        {isEditing ? (
                            <div>
                                <h2>Edit Savings Goal</h2>
                                <div>
                                    <label>Savings Goal:</label>
                                    <input
                                        type="number"
                                        value={savingsGoal}
                                        onChange={(e) => setSavingsGoal(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label>Current Savings:</label>
                                    <input
                                        type="number"
                                        value={currentSavings}
                                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                    />
                                </div>
                                <button onClick={handleSave}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <button className="edit-goal-btn" onClick={toggleEditGoal}>
                                    <FaEdit /> Edit Goal
                                </button>
                                <h2>Savings Goal</h2>
                                <div className="progress-labels">
                                    <span>${currentSavings}</span>
                                    <span>${savingsGoal}</span>
                                </div>
                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundColor: getGreenShade(),
                                        }}
                                    />
                                </div>
                                <p className="savings-text">
                                    {`${progressPercentage.toFixed(2)}% of $${savingsGoal} saved`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
