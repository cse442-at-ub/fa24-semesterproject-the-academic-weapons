import React, { useState, useEffect } from 'react';
import { FaPiggyBank, FaEdit } from 'react-icons/fa';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ username, openSettings, pfpMap, pfp, allocated_saving_amount, monthly_saving_goal, onUpdateMonthlyGoal, onUpdateAllocation })  => {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = sessionStorage.getItem("User");

    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAllocating, setIsAllocating] = useState(false);
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
            setIsEditing(false); 
            setIsAllocating(false); 
        }
    };

    const goBackFromEdit = () => {
        setIsEditing(false);
    };

    const goBackFromAllocate = () => {
        setIsAllocating(false);
    };

    const toggleEditGoal = () => {
        setIsEditing(!isEditing);
        if (isAllocating) {
            setIsAllocating(false);
        }
    };

    const toggleAllocateGoal = () => {
        setIsAllocating(!isAllocating);
        if (isEditing) {
            setIsEditing(false);
        }
    };

    const handleSaveMonthlyGoal = () => {
        onUpdateMonthlyGoal(savingsGoal);
        setIsEditing(false); // Exit edit mode after saving
    };

    const handleSaveAllocation = () => {
        onUpdateAllocation(manageAmount);
        setManageAmount(0); // Reset the input field
        setIsAllocating(false); // Exit allocating mode
    };

    // Effect to update local state when props change
    useEffect(() => {
        setCurrentSavings(allocated_saving_amount);
        setSavingsGoal(monthly_saving_goal);
    }, [allocated_saving_amount, monthly_saving_goal]);

    const progressPercentage = Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100);
    const getGreenShade = () => {
        const greenValue = Math.min(Math.round(progressPercentage * 2.55), 255);
        return `rgb(0, ${greenValue}, 0)`;
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
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setSavingsGoal(value);
                                            console.log("Updated savings goal:", value); // Log the updated value
                                        }}
                                    />
                                </div>
                                <button onClick={handleSaveMonthlyGoal} className='save_btn_nav'>Save</button>
                                <button onClick={goBackFromEdit} className="back-btn">Back</button>
                            </div>
                            ) : isAllocating ? (
                                <div>
                                    <h2>Manage Goal</h2>
                                    <p>Input positive number to allocate to goal</p>
                                    <p>Input negative number to remove from goal</p>
                                    <div>
                                        <label>Manage Amount: </label>
                                        <input
                                            type="number"
                                            value={manageAmount} // Keep the input controlled
                                            onChange={(e) => {
                                                const value = e.target.value; // Get raw string value to allow clearing
                                                setManageAmount(value); // Set as string directly
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <button className='save_btn_nav' onClick={handleSaveAllocation}>Save Changes</button>
                                        <button onClick={goBackFromAllocate} className="back-btn">Back</button>
                                    </div>
                                </div>
                            ) : (
                            <div>
                                <div className='piggybank_buttons_container'>
                                    <button className="edit-goal-btn" onClick={toggleEditGoal}>
                                        <FaEdit /> Edit Goal
                                    </button>
                                    <button className="edit-allocate-goal-btn" onClick={toggleAllocateGoal}>
                                        <FaEdit /> Manage Goal
                                    </button>
                                </div>
                                <h2>Savings Goal</h2>
                                <div className="progress-labels">
                                    <span>${currentSavings.toFixed(2)}</span>
                                    <span>${savingsGoal.toFixed(2)}</span>
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
                                    {`${progressPercentage.toFixed(2)}% of $${savingsGoal.toFixed(2)} saved`}
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