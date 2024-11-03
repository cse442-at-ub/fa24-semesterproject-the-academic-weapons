import React, { useState, useEffect } from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';

const CloseButton = ({ onClick }) => (
    <button className="close-button_piggy_bank_overlay" onClick={onClick}>
        Close
    </button>
);

const Navbar = ({ username, openSettings, pfpMap, pfp, allocated_saving_amount, monthly_saving_goal, onUpdateMonthlyGoal, onUpdateAllocation }) => {
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("User");

    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [currentSavings, setCurrentSavings] = useState(allocated_saving_amount);
    const [savingsGoal, setSavingsGoal] = useState(monthly_saving_goal);
    const [manageAmount, setManageAmount] = useState(0);
    const [tempSavingsGoal, setTempSavingsGoal] = useState(monthly_saving_goal);
    const [tempManageAmount, setTempManageAmount] = useState(0);

    // New states for the separate overlays
    const [showMainModal, setShowMainModal] = useState(false);
    const [showAllocateModal, setShowAllocateModal] = useState(false);
    const [showDeallocateModal, setShowDeallocateModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    const openMainModal = () => {
        setShowAllocateModal(false);
        setShowDeallocateModal(false);
        setShowGoalModal(false);
        setShowSavingsModal(true);
        setShowMainModal(true); // Set main modal state to true
    };

    const logout = () => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
    };

    const toggleSavingsModal = () => {
        setShowSavingsModal(!showSavingsModal);
    };

    const handleSaveMonthlyGoal = () => {
        const parsedGoal = Number(tempSavingsGoal);
        if (isNaN(parsedGoal) || parsedGoal < 0) {
            alert("Please enter a valid savings goal.");
            return;
        }
        onUpdateMonthlyGoal(parsedGoal);
        setSavingsGoal(parsedGoal);
    };

    const handleSaveAllocation = (allocationAmount) => {
        let newAllocation = allocationAmount;
        if (newAllocation < 0 && currentSavings + newAllocation < 0) {
            newAllocation = -currentSavings;
        }
        if (currentSavings + newAllocation > savingsGoal) {
            newAllocation = savingsGoal - currentSavings;
        }
        onUpdateAllocation(newAllocation);
        setCurrentSavings(currentSavings + newAllocation);
        setTempManageAmount(0);
    };

    useEffect(() => {
        setCurrentSavings(allocated_saving_amount);
        setSavingsGoal(monthly_saving_goal);
        setTempSavingsGoal(monthly_saving_goal);

        

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeAllModals();
            }
        };

        const handleEnter = (event) => {
            if (event.key === 'Enter') {
                if (tempManageAmount || tempSavingsGoal) { // Checks if there's input in any field
                    if (showAllocateModal) {
                        handleSaveAllocation(tempManageAmount);
                    } else if (showDeallocateModal) {
                        handleSaveAllocation(-Math.abs(tempManageAmount));
                    } else if (showGoalModal) {
                        handleSaveMonthlyGoal();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleEnter);

        return () => document.removeEventListener('keydown', handleEscape);  document.removeEventListener('keydown', handleEnter);
    }, [allocated_saving_amount, monthly_saving_goal, tempManageAmount, tempSavingsGoal, showAllocateModal, showDeallocateModal, showGoalModal]);

    const progressPercentage = savingsGoal > 0 ? Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100) : 0;
    const greenLevel = Math.floor(Math.pow(progressPercentage / 100, 0.75) * 128);
    const progressColor = `rgb(0, ${greenLevel}, 0)`;
    
    const validSavingsGoal = Number(savingsGoal) || 0;

    const closeAllModals = () => {
        setShowMainModal(false);
        setShowSavingsModal(false);
        setShowAllocateModal(false);
        setShowDeallocateModal(false);
        setShowGoalModal(false);
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
                <div className="navbar-savings-container" onClick={toggleSavingsModal}>
                    <FaPiggyBank className="savings-icon" style={{ fontSize: '2rem' }} />
                    <div className="mini-progress-bar-container">
                        <div
                            className="mini-progress-bar"
                            style={{
                                width: `${progressPercentage}%`,
                                backgroundColor: progressColor,
                            }}
                        />
                    </div>
                </div>
                <div className="logout_text" onClick={logout}>Log Out</div>
            </div>

            {showSavingsModal && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-content_piggy" onClick={(e) => e.stopPropagation()}>
                        <div className='close_button_piggy_cotnainer'>
                            <CloseButton onClick={closeAllModals} />
                        </div>
                        <div className='values_container_piggy'>
                            <p className="savings-text_percentage_main">${currentSavings.toFixed(2)} Allocated </p>
                            <p className="allocated-text-piggy-top">${savingsGoal.toFixed(2)} Saved</p>
                        </div>
                        <div className="progress-container_piggy">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${progressPercentage}%`,
                                    backgroundColor: progressColor,
                                }}
                            />
                        </div>
                        <p className="savings-Data_Centered_piggy">{`${progressPercentage.toFixed(2)}% of $${savingsGoal.toFixed(2)} saved`}</p>
                        
                        <div className='piggybank_buttons_container'>
                            <button onClick={() => { setShowAllocateModal(true); setShowSavingsModal(false); }} className="allocate_save_btn_nav">Allocate to Goal</button>
                            <button onClick={() => { setShowDeallocateModal(true); setShowSavingsModal(false); }} className="deallocate_save_btn_nav">Deallocate from Goal</button>
                            <button onClick={() => { setShowGoalModal(true); setShowSavingsModal(false); }} className="save_btn_nav">Change Goal Amount</button>
                        </div>
                    </div>
                </div>
            )}

            {showAllocateModal && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div onClick={(e) => e.stopPropagation()} className="edit_piggy_bank_modal_container">
                    <   div className='close_button_piggy_cotnainer'>
                            <CloseButton onClick={closeAllModals} />
                        </div>
                        <h1 className="edit_trans_title">Allocate Towards Goal</h1>
                        <p className="modal-info">Goal: ${savingsGoal.toFixed(2)}</p>
                        <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                        <input
                            className="input_field_piggy"
                            type="number"
                            value={tempManageAmount || ''} // Allow empty input
                            onChange={(e) => {
                                const value = e.target.value;
                                const numberValue = Number(value);
                                
                                // Check if the value is empty or if it is NaN or negative
                                if (value === '' || isNaN(numberValue) || numberValue < 0) {
                                    setTempManageAmount(0); // Clear the input field
                                } else {
                                    setTempManageAmount(numberValue); // Set the number value if valid
                                }
                            }}
                        />
                        <button onClick={() => handleSaveAllocation(tempManageAmount)} className="edit_piggy_stuff_allocate">Allocate</button>
                        <div className="back_text_piggy_overlay" onClick={openMainModal}>Cancel</div>
                    </div>
                </div>
            )}

        {showDeallocateModal && (
            <div className="modal-overlay" onClick={closeAllModals}>
                <div onClick={(e) => e.stopPropagation()} className="edit_piggy_bank_modal_container">
                    <div className='close_button_piggy_cotnainer'>
                        <CloseButton onClick={closeAllModals} />
                    </div>
                    <h1 className="edit_trans_title">Deallocate From Goal</h1>
                    <p className="modal-info">Goal: ${savingsGoal.toFixed(2)}</p>
                    <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                    <input
                        className="input_field_piggy"
                        type="number"
                        value={tempManageAmount || ''} // Allow empty input
                        onChange={(e) => {
                            const value = e.target.value;
                            const numberValue = Number(value);
                            if (value === '') {
                                setTempManageAmount(''); // Set state to empty string if input is cleared
                            } else if (!isNaN(numberValue)) {
                                setTempManageAmount(numberValue);
                            }
                        }}
                    />
                    <button onClick={() => handleSaveAllocation(-Math.abs(tempManageAmount))} className="edit_piggy_stuff_deallocate">Deallocate</button>
                    <div className="back_text_piggy_overlay" onClick={openMainModal}>Cancel</div>
                </div>
            </div>
        )}

            {showGoalModal && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div onClick={(e) => e.stopPropagation()} className="edit_piggy_bank_modal_container">
                        <div className='close_button_piggy_cotnainer'>
                            <CloseButton onClick={closeAllModals} />
                        </div>
                        <h1 className="edit_trans_title">Change Goal Amount</h1>
                        <p className="modal-info">Current Goal: ${savingsGoal.toFixed(2)}</p>
                        <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                        <input
                            className="input_field_piggy"
                            type="number"
                            value={tempSavingsGoal}
                            onChange={(e) => setTempSavingsGoal(Number(e.target.value))}
                        />
                        <button onClick={handleSaveMonthlyGoal} className="edit_piggy_stuff_change_goal">Save</button>
                        <div className="back_text_piggy_overlay" onClick={openMainModal}>Cancel</div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
