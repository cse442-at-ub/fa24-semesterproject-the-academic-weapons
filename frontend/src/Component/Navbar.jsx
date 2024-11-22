import React, {useState, useEffect, useRef} from 'react';
import {FaBars, FaPiggyBank} from 'react-icons/fa';
import logo from '../logo.svg';
import { FaBell } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const CloseButton = ({ onClick, text }) => (
    <button className="close-button_piggy_bank_overlay" onClick={onClick}>{text}</button>
);

const Navbar = ({openError, setErrorMessage, username, openSettings, pfpMap, pfp, allocated_saving_amount, monthly_saving_goal, onUpdateMonthlyGoal, onUpdateAllocation }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("User");

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]); // Empty by default


    const bellRef = useRef(null);
    const dropdownRef = useRef(null);

    const [currentModal, setCurrentModal] = useState(null);
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

    const toggleMobileMenu = () => {
        if (window.innerWidth < 768) { // Only open the mobile menu for screens smaller than 768px
            setIsMobileMenuOpen(!isMobileMenuOpen);
        }
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
            setErrorMessage("Please enter a valid savings goal.");
            openError()
            return;
        }
        onUpdateMonthlyGoal(parsedGoal);
        setSavingsGoal(parsedGoal);
        setCurrentModal('savings');
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
        setCurrentModal('savings');
    };

    const handleAllocateChange = (e) => {
        const value = e.target.value;
        const numberValue = Number(value);
        setTempManageAmount(isNaN(numberValue) || numberValue < 0 ? 0 : numberValue);
    };
    const fetchNotifications = async () => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_PATH}/routes/notifications.php?userId=${userID}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
            setNotifications(data.notifications);
        } else {
            console.error("Failed to fetch notifications: ", data.message || "Unknown error");
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

    useEffect(() => {
        fetchNotifications();


         const handleClickOutside = (event) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !bellRef.current.contains(event.target)
          ) {
            setIsNotificationOpen(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);

        setCurrentSavings(allocated_saving_amount);
        setSavingsGoal(monthly_saving_goal);
        setTempSavingsGoal(monthly_saving_goal);

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeAllModals();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [allocated_saving_amount, monthly_saving_goal]);

    const progressPercentage = savingsGoal > 0 ? Math.min((Number(currentSavings) / Number(savingsGoal)) * 100, 100) : 0;
    const greenLevel = Math.floor(Math.pow(progressPercentage / 100, 0.75) * 128);
    const progressColor = `rgb(0, ${greenLevel}, 0)`;

    const openModal = (modalType) => {
        setCurrentModal(modalType);
        setIsMobileMenuOpen(false); // Close the mobile menu when a modal is opened
    };

    const closeAllModals = () => {
        setCurrentModal(null);
    };

    const validSavingsGoal = Number(savingsGoal) || 0;
    const displaySavingsGoal = isNaN(validSavingsGoal) ? 0 : validSavingsGoal;
    const handleGoalChange = (e) => {
        const value = e.target.value;
        if (value === '' || isNaN(Number(value))) {
            setTempSavingsGoal(''); // Clear input if empty or invalid
        } else {
            setTempSavingsGoal(value); // Allow valid input
        }
    };
    // Handle notification dropdown toggle
    const toggleNotifications = () => {
    setIsNotificationOpen((prevState) => !prevState);
    };


    const markNotificationAsRead = async (id) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_PATH}/routes/notifications.php`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAsRead: [id] }),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to mark notification as read: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );
        } else {
            console.error("Failed to mark notification as read:", data.message || "Unknown error");
        }
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};


const markAllAsRead = async () => {
    try {
        const unreadIds = notifications
            .filter((notification) => !notification.isRead)
            .map((notification) => notification.id);

        if (unreadIds.length === 0) {
            console.warn("No unread notifications to mark as read.");
            return;
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_PATH}/routes/notifications.php`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAsRead: unreadIds }),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
            setNotifications((prev) =>
                prev.map((notification) => ({ ...notification, isRead: true }))
            );
        } else {
            console.error("Failed to mark all notifications as read:", data.message || "Unknown error");
        }
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
};

    // Count unread notifications
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (!userID) {
        return null;
    }

    return (
        <nav className="navbar">
            <div onClick={() => navigate('/')} className="navbar-logo">
                <img src={logo} alt="Wealth Wise Logo" className="logo-image"/>
                <span className="logo-text">Wealth <br/> Wise</span>
            </div>
            <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
                <FaBars/>
            </button>

            {isMobileMenuOpen && (
                <div className="mobile-nav-dropdown">
                    <div className="mobile-nav-item" onClick={() => {
                        openSettings();
                        setIsMobileMenuOpen(false);
                    }}>
                        <div className="navbar_name_container">
                            <img src={pfpMap[pfp]} alt="Profile Icon" className="profile-icon"/>
                            <div className="navbar_name">{username}</div>
                        </div>
                    </div>
                    
                    <div className='mobile-nav-item'>
                    <div
          className="notification-icon-container"
          ref={bellRef}
          onClick={toggleNotifications}
        >
          <FaBell className="notification-icon" />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        {isNotificationOpen && (
            <div className="notification-dropdown" ref={dropdownRef}>
                <div className="notification-header">
                    <h3>Notifications</h3>
                    <button onClick={markAllAsRead} className="mark-read-btn">
                        Mark All as Read
                    </button>
                </div>
                <ul className="notification-list">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`notification-item ${
                                notification.isRead ? "read" : "unread"
                            }`}
                        >
                            <div className="notification-card">
                                <div className="notification-content">
                                    <p className="notification-title">
                                        {notification.message}
                                    </p>
                                    <p className="notification-due-date">
                                        <strong>Due Date:</strong> {notification.dueDate}
                                    </p>
                                </div>
                                <div className="notification-actions">
                                    {!notification.isRead ? (
                                        <button
                                            className="mark-read-btn"
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            Mark as Read
                                        </button>
                                    ) : (
                                        <span className="read-status">Read</span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {notifications.length === 0 && (
                    <p className="no-notifications">No notifications available.</p>
                )}
            </div>
        )}
                    </div>

                    <div className="mobile-nav-item" onClick={() => openModal('savings')}>
                        <FaPiggyBank className="savings-icon"/>
                        <span>Savings Overview</span>
                    </div>
                    <div className="mobile-nav-item logout_text" onClick={logout}>
                        Log Out
                    </div>
                </div>
            )}


            <div className="navbar-profile">
                <div className="navbar_name_icon_group" onClick={openSettings}>
                    <div className="navbar_name">{username}</div>
                    <img src={pfpMap[pfp]} alt="Profile Icon" className="profile-icon"/>
                </div>
                 {/* Notifications */}
        <div
          className="notification-icon-container"
          ref={bellRef}
          onClick={toggleNotifications}
        >
          <FaBell className="notification-icon" />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        {isNotificationOpen && (
            <div className="notification-dropdown" ref={dropdownRef}>
                <div className="notification-header">
                    <h3>Notifications</h3>
                    <button onClick={markAllAsRead} className="mark-read-btn">
                        Mark All as Read
                    </button>
                </div>
                <ul className="notification-list">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`notification-item ${
                                notification.isRead ? "read" : "unread"
                            }`}
                        >
                            <div className="notification-card">
                                <div className="notification-content">
                                    <p className="notification-title">
                                        {notification.message}
                                    </p>
                                    <p className="notification-due-date">
                                        <strong>Due Date:</strong> {notification.dueDate}
                                    </p>
                                </div>
                                <div className="notification-actions">
                                    {!notification.isRead ? (
                                        <button
                                            className="mark-read-btn"
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            Mark as Read
                                        </button>
                                    ) : (
                                        <span className="read-status">Read</span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {notifications.length === 0 && (
                    <p className="no-notifications">No notifications available.</p>
                )}
            </div>
        )}
                <div className="navbar-savings-container" onClick={() => openModal('savings')}>
                    <FaPiggyBank className="savings-icon" style={{fontSize: '2rem', cursor: 'pointer'}}/>
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

            {/* Savings Modal */}
            {currentModal === 'savings' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-content_piggy" onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={closeAllModals}/>
                        <div className='values_container_piggy'>
                            <p className="savings-text_percentage_main">${currentSavings.toFixed(2)} Allocated</p>
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
                            <button onClick={() => openModal('allocate')} className="allocate_save_btn_nav">Allocate
                            </button>
                            <button onClick={() => openModal('deallocate')}
                                    className="deallocate_save_btn_nav">Deallocate
                            </button>
                            <button onClick={() => openModal('changeGoal')} className="save_btn_nav">Change Goal
                            </button>
                        </div>
                        <CloseButton text={"Close"} onClick={closeAllModals}/>
                    </div>
                </div>
            )}
            {/* Allocate Modal */}
            {currentModal === 'allocate' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="edit_piggy_bank_modal_container" onClick={(e) => e.stopPropagation()}>
                        <h1 className="edit_trans_title">Allocate Towards Goal</h1>
                        <p className="modal-info">Goal: ${savingsGoal.toFixed(2)}</p>
                        <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                        <div className={"allocate_modal_group"}>
                            <input
                                className="input_field_piggy"
                                type="number"
                                value={tempManageAmount || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || !isNaN(Number(value))) {
                                        setTempManageAmount(value);
                                    }
                                }}
                            />
                            <button onClick={() => handleSaveAllocation(Number(tempManageAmount))}
                                    className="edit_piggy_stuff_allocate">Allocate
                            </button>
                            <CloseButton text={"Cancel"} onClick={closeAllModals}/>
                        </div>
                    </div>
                </div>
            )}

            {/* Deallocate Modal */}
            {currentModal === 'deallocate' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="edit_piggy_bank_modal_container" onClick={(e) => e.stopPropagation()}>

                        <h1 className="edit_trans_title">Deallocate From Goal</h1>
                        <p className="modal-info">Goal: ${savingsGoal.toFixed(2)}</p>
                        <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                        <div className={"allocate_modal_group"}>
                            <input
                                className="input_field_piggy"
                                type="number"
                                value={tempManageAmount || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || !isNaN(Number(value))) {
                                        setTempManageAmount(value);
                                    }
                                }}
                            />
                            <button onClick={() => handleSaveAllocation(-Math.abs(Number(tempManageAmount)))}
                                    className="edit_piggy_stuff_allocate">Deallocate
                            </button>
                            <CloseButton text={"Cancel"} onClick={closeAllModals}/>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Goal Modal */}
            {currentModal === 'changeGoal' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="edit_piggy_bank_modal_container" onClick={(e) => e.stopPropagation()}>

                        <h1 className="edit_trans_title">Change Goal Amount</h1>
                        <p className="modal-info">Current Goal: ${savingsGoal.toFixed(2)}</p>
                        <p className="modal-info">Allocated: ${currentSavings.toFixed(2)}</p>
                        <div className={"allocate_modal_group"}>
                            <input
                                className="input_field_piggy"
                                type="number"
                                value={tempSavingsGoal}
                                onChange={handleGoalChange}
                                onFocus={() => setTempSavingsGoal('')} // Clears the field on focus
                            />
                            <button onClick={handleSaveMonthlyGoal} className="edit_piggy_stuff_allocate">Save
                            </button>
                            <CloseButton text={"Cancel"} onClick={closeAllModals}/>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;