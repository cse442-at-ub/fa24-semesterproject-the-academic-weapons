import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteAccount = ({ setErrorMessage, openError, closeModal }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token');

    useEffect(() => {
        if (!userID) {
            sessionStorage.clear();
            navigate('/');
            window.location.reload();
        }
    }, [navigate, userID]);

    const handleConfirmDelete = async () => {
        if (!password) {
            setErrorMessage("Password is required to delete account.");
            openError();
            return;
        }

        try {
            const url = `${import.meta.env.VITE_API_PATH}/routes/delete_account.php`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, userID, userToken }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (!data.auth) {
                setErrorMessage("Invalid user credentials, please sign in again.");
                openError();
                sessionStorage.clear();
                navigate('/');
                window.location.reload();
                return;
            }

            if (!data.success) {
                setErrorMessage(data.message || 'Failed to delete account.');
                openError();
            } else {
                setErrorMessage("Account deleted successfully.");
                openError();
                sessionStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again later.");
            openError();
        }
    };


    return (
        <div onClick={closeModal} className="change_background">
            <div onClick={(event) => event.stopPropagation()} className="change_modal_container">
                <div className="change_modal_title_desc_container">
                    <h2 className="delete_account_title">Delete Account</h2>
                    <p className="delete_warning">ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?</p>
                    <div className="change_modal_desc">
                        Enter your password to confirm deletion of your account.
                    </div>
                </div>
                <div className="change_form">
                    <div className="label_container">
                        <label className="change_label">Password</label>
                    </div>
                    <input
                        type="password"
                        className="change_field"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        title={password.trim() === '' ? "Please enter your password to delete account" : null}
                        disabled={password.trim() === ''}
                        onClick={handleConfirmDelete}
                        className={password.trim() === '' ? 'delete_button_disabled' : 'delete_button'}
                    >
                         Delete
                    </button>
                </div>
                <div className="change_cancel" onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
};

export default DeleteAccount;
