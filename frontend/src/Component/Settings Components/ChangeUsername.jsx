import React, { useEffect, useState } from "react";

const ChangeUsername = ({ closeModal, changeUsername }) => {
    const [newUsername, setNewUsername] = useState('');

    const updateUsername = () => {
        changeUsername(newUsername);
        saveUsernameToDatabase().then(r => closeModal());
    }

    const saveUsernameToDatabase = async () => {
        let url = `${import.meta.env.VITE_API_PATH}/routes/save-username`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newUsername}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (!data.success) {
            alert(data.message || 'Saving new username failed!');
        }
    }

    return (
        <div onClick={closeModal} className={"change_background"}>
            <div onClick={event => event.stopPropagation()} className={"change_modal_container"}>
                <div className={"change_modal_title_desc_container"}>
                    <h2>Change Username</h2>
                    <div className={"change_modal_desc"}>Enter your new username and click 'Change' to update your
                        account.
                    </div>
                </div>
                <div className={"change_form"}>
                    <div className={"label_container"}>
                        <label className={"change_label"}>New Username</label>
                    </div>
                    <input className={"change_field"} type={"text"} value={newUsername}
                           onChange={e => setNewUsername(e.target.value)}/>
                    <button onClick={updateUsername} className={"change_button"}>Change</button>
                </div>
                <div className={"change_cancel"} onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
};
export default ChangeUsername;