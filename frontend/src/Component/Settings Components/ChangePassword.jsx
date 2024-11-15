import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS Files/Settings Components/ChangePassword.css";

const ChangePassword = ({setErrorMessage, openError, closeModal }) => {
    const navigate = useNavigate();
    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    // State variables to toggle password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    useEffect(() => {

        if (!userID || !userToken) {
            sessionStorage.removeItem('User');
            navigate('/')
            window.location.reload();
        }

    })

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return regex.test(password);
    };

    const saveNewPassword = async () => {
        if (newPassword !== retypePassword) {

            setErrorMessage("New Password and Retype Password do not match.");
            openError()
            return;
        }
    
        const url = `${import.meta.env.VITE_API_PATH}/routes/change_password_homepage.php`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword, userID, userToken }),
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
    
        if (!data.success) {
            setErrorMessage(data.message || 'Changing password failed!');
            openError()
        } else {
            setErrorMessage("Password changed successfully!");
            openError()
            closeModal();  // Close modal on success 
        }
    };

    const handleSave = () => {
        if (!validatePassword(newPassword)) {
            setErrorMessage("New Password does not meet requirements.");
            openError()
            return;
        }
        if (newPassword !== retypePassword) {
            setErrorMessage("New Password and Retype Password do not match.");
            openError()
            return;
        }
        saveNewPassword();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 

            if (currentPassword && newPassword && retypePassword) {
                handleSave();
            }
        }
    };
    
    return (
        <div onClick={closeModal} className="change_password_background">
            <div onClick={(event) => event.stopPropagation()} className="change_modal_container_homepage">
                <div className="change_modal_title_desc_container">
                    <h2 className="Change_password_homepage">Change Password</h2>
                    <div className="change_modal_desc">
                        Enter your current password, and choose a new one.
                    </div>
                </div>
                <div className="change_form_password_settings_change" onKeyDown={handleKeyDown}>
                    {/* Current Password Field */}
                    <div className="label_container_password_change_home">
                        <label className="change_label">Current Password</label>
                        <button 
                            type="button" 
                            className="toggle_visibility_password_homepage"
                            onClick={() => setShowCurrentPassword(prev => !prev)}
                        >
                            {showCurrentPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="password_container">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            className="change_field"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>
                    <p className="pass_requir_txt_homepage">Password must contain at least 8 characters 1
                    uppercase letter,1 number, 1 special character.</p>
                    {/* New Password Field */}
                    <div className="label_container_password_change_home">
                        <label className="change_label">New Password</label>
                        <button 
                            type="button" 
                            className="toggle_visibility_password_homepage"
                            onClick={() => setShowNewPassword(prev => !prev)}
                        >
                            {showNewPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="password_container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className="change_field"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                            title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
                        />
                    </div>

                    {/* Retype Password Field */}
                    <div className="label_container_password_change_home">
                        <label className="change_label">Retype Password</label>
                        <button 
                            type="button" 
                            className="toggle_visibility_password_homepage"
                            onClick={() => setShowRetypePassword(prev => !prev)}
                        >
                            {showRetypePassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="password_container">
                        <input
                            type={showRetypePassword ? "text" : "password"}
                            className="change_field"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            required
                            pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                            title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className={newPassword === '' || retypePassword === '' ? 'change_button_disabled_Password_homepage' : 'change_button_Password_homepage'}
                        disabled={newPassword === '' || retypePassword === ''}
                    >
                        Save Changes
                    </button>
                </div>
                <div className="change_cancel_PASSCHANGE" onClick={closeModal}>
                    Cancel
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
