import React, { useState } from 'react';
import { FaPiggyBank, FaEdit } from 'react-icons/fa';
import logo from '../logo.svg';
import person1 from '../Assets/Profile Pictures/Person1.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ username, openSettings, pfpMap, pfp, currentSavings, setSavingsGoal, increaseSavingsGoal, decreaseSavingsGoal, increaseAllocationAmount, decreaseAllocationAmount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userID = sessionStorage.getItem("User");

    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode
    const [isAllocating, setIsAllocating] = useState(false);
    const [currentSavings, setCurrentSavings] = useState(400); // Example current savings
    const [savingsGoal, setSavingsGoal] = useState(1000); // Example goal

    const logout = () => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
    };

    // Modal switching
    const toggleSavingsModal = () => {
        setShowSavingsModal(!showSavingsModal);
        if (showSavingsModal) {
            setIsEditing(false); 
            setIsAllocating(false); // Reset allocation state when closing the modal
        }
    };

    const goBackFromEdit = () => {
        setIsEditing(false);
    };

    const goBackFromAllocate = () => {
        setIsAllocating(false); // Switch back to non-allocating state
    };

    const toggleEditGoal = () => {
        setIsEditing(!isEditing);
        if (isAllocating) {
            setIsAllocating(false); // Switch off allocation if editing is opened
        }
    };

    const toggleAllocateGoal = () => {
        setIsAllocating(!isAllocating);
        if (isEditing) {
            setIsEditing(false); // Switch off editing if allocation is opened
        }
    };

    const handleSave = () => {
        setIsEditing(false); // Exit edit mode after saving
        // Backend Logic here.
    };

    // END OF MODAL SWITCHNG AND START OF Function to calculate the progress percentage and color
    const progressPercentage = Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100);
    const getGreenShade = () => {
        const greenValue = Math.min(Math.round(progressPercentage * 2.55), 255); // Max is 255 for full green
        return `rgb(0, ${greenValue}, 0)`; // More green as progress increases
        // if (progressPercentage <= 24) { THIS COMMENTED SECTION IS A VERY BARE BONES OF START FROM RED TO ORANGE TO YELLOW TO GREEN
        //YELLOW TO GREEN IS BAD SO TESTING MAY BE NEEDED
        //     const redValue = Math.round(255 - (progressPercentage * 10.625));
        //     return `rgb(${redValue}, 0, 0)`;
        //   } else if (progressPercentage <= 40) {
        //     const greenValue = Math.round((progressPercentage - 25) * 6.375);
        //     return `rgb(255, ${greenValue}, 0)`;
        //   } else if (progressPercentage <= 60) {
        //     const redValue = Math.round(255 - ((progressPercentage - 40) * 6.375));
        //     return `rgb(${redValue}, 255, 0)`;
        //   } else {
        //     const greenValue = Math.round((progressPercentage - 60) * 4.25);
        //     return `rgb(0, ${greenValue}, 0)`;
        //   }
        // };
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
                                {/* <div> THIS WAS THE CURRENT SAVING GOAL FEATURE, KEEPING IN CASE IT NEEDS TO BE USED
                                    <label>Current Savings:</label>
                                    <input
                                        type="number"
                                        value={currentSavings}
                                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                    />
                                </div> */}
                                <button onClick={handleSave} className='save_btn_nav'>Save</button>
                                <button onClick={goBackFromEdit} className="back-btn">Back</button> {/* Show Back Button only in edit mode */}
                            </div>
                        ) : isAllocating ? ( // New allocation overlay
                            <div>
                                <h2>Allocate to Goal</h2>
                                <div>
                                    <label>Allocate Amount:</label>
                                    <input
                                        type="number"
                                        //implement allocation logic here
                                    />
                                </div>
                                <div>
                                    <label>Remove Amount:</label>
                                    <input
                                        type="number"
                                        //implement removal logic here
                                    />
                                </div>
                                <button className='save_btn_nav'>Save Allocation</button>
                                <button onClick={goBackFromAllocate} className="back-btn">Back</button>
                            </div>
                        ) : (
                            <div>
                                <div className='piggybank_buttons_container'>
                                    <button className="edit-goal-btn" onClick={toggleEditGoal}>
                                        <FaEdit /> Edit Goal
                                    </button>
                                    <button className="edit-allocate-goal-btn" onClick={toggleAllocateGoal}>
                                        <FaEdit /> Allocate to Goal
                                    </button>
                                </div>
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