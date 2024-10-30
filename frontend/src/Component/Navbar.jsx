import React, { useState, useEffect } from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ username, openSettings, pfpMap, pfp, allocated_saving_amount, monthly_saving_goal, onUpdateMonthlyGoal, onUpdateAllocation }) => {
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("User");

    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [showCombinedModal, setShowCombinedModal] = useState(false);
    const [currentSavings, setCurrentSavings] = useState(allocated_saving_amount);
    const [savingsGoal, setSavingsGoal] = useState(monthly_saving_goal);
    const [manageAmount, setManageAmount] = useState(0); // For allocation input

    const logout = () => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
    };

    const toggleSavingsModal = () => {
        setShowSavingsModal(!showSavingsModal);
        if (showSavingsModal) {
            setShowCombinedModal(false); // Close combined modal if opening savings modal
        }
    };

    const openCombinedModal = () => {
        setShowCombinedModal(true); // Open combined modal
        setShowSavingsModal(false); // Close savings modal
    };

    const goBackFromCombined = () => {
        setShowCombinedModal(false); // Close combined modal
        setShowSavingsModal(true); // Open the original modal
    };

    const handleSaveMonthlyGoal = () => {
        onUpdateMonthlyGoal(savingsGoal);
    };

    const handleSaveAllocation = () => {
        let newAllocation = Number(manageAmount);
        // Cap allocation to savings goal
        if (currentSavings + newAllocation > savingsGoal) {
            newAllocation = savingsGoal - currentSavings; // Adjust allocation to not exceed goal
        }

        // Update the database with the new allocation
        onUpdateAllocation(newAllocation);
        
        // Update local state
        setCurrentSavings(currentSavings + newAllocation);
        setManageAmount(0); // Reset the input field
    };

    // Effect to update local state when props change
    useEffect(() => {
        setCurrentSavings(allocated_saving_amount);
        setSavingsGoal(monthly_saving_goal);
    }, [allocated_saving_amount, monthly_saving_goal]);

    const progressPercentage = Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100);

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
                        <div className="mini-progress-bar" style={{ width: `${progressPercentage}%`, backgroundColor: 'green' }} />
                    </div>
                </div>
                <div className="logout_text" onClick={logout}>Log Out</div>
            </div>

            {showSavingsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={toggleSavingsModal}>Close</button>
                        <h2>Savings Goal</h2>
                        <div className="progress-labels">
                            <span>${currentSavings.toFixed(2)}</span>
                            <span>${savingsGoal.toFixed(2)}</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progressPercentage}%`, backgroundColor: 'green' }} />
                        </div>
                        <p className="savings-text">{`${progressPercentage.toFixed(2)}% of $${savingsGoal.toFixed(2)} saved`}</p>
                        <button onClick={openCombinedModal} className="manage-goal-btn">Manage Goal</button>
                    </div>
                </div>
            )}

            {showCombinedModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={goBackFromCombined}>Back</button>
                        <h2>Manage Savings Goal</h2>
                        <div className="modal-body">
                            <div className="edit-section">
                                <h3>Edit Savings Goal Amount</h3>
                                <label>Savings Goal:</label>
                                <input
                                    type="number"
                                    value={savingsGoal}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSavingsGoal(value);
                                    }}
                                />
                                <button onClick={handleSaveMonthlyGoal} className='save_btn_nav'>Save Goal Amount</button>
                            </div>
                            <div className="allocate-section">
                                <h3>Allocate / Deallocate from Goal </h3>
                                <p>Input positive number to allocate to goal</p>
                                <p>Input negative number to remove from goal</p>
                                <label>Manage Amount:</label>
                                <input
                                    type="number"
                                    value={manageAmount}
                                    onChange={(e) => setManageAmount(e.target.value)} // Allowing to be cleared easily
                                />
                                <button className='save_btn_nav' onClick={handleSaveAllocation}>Save Changes to Goal</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
