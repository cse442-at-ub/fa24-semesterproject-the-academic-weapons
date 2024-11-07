import React, { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import ChangeUsername from "../Component/Settings Components/ChangeUsername";
import ChangePFP from "../Component/Settings Components/ChangePFP";
import ChangePassword from "../Component/Settings Components/ChangePassword.jsx";
import DeleteAccount from "../Component/Settings Components/DeleteAccount.jsx";


const Settings = ({ openError, setErrorMessage, closeSettings, pfpMap, changePFP, pfp, username, changeUsername, deleteAccount }) => {
    const active = 'settings_button_active';
    const inactive = 'settings_button_inactive';
    const top_active = "settings_top_tab_button_active";
    const top_inactive = "settings_top_tab_button_inactive";
    const change_button = 'settings_tab_row_button';
    const [showSettings, setShowSettings] = useState('General');
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [showChangePFP, setShowChangePFP] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const openUsername = () => setShowChangeUsername(true);
    const closeUsername = () => setShowChangeUsername(false);
    const openChangePFP = () => setShowChangePFP(true);
    const closeChangePFP = () => setShowChangePFP(false);
    const openChangePassword = () => setShowChangePassword(true);
    const closeChangePassword = () => setShowChangePassword(false);
    const openDeleteAccount = () => setShowDeleteAccount(true);
    const closeDeleteAccount = () => setShowDeleteAccount(false);
    return (
        <div onClick={closeSettings} className={"settings_modal_bg_container"}>
            <div onClick={event => event.stopPropagation()} className={"settings_modal_container"}>
                <div className={"settings_modal_title_band"}>
                    <h2>Settings</h2>
                    <RiCloseLargeLine color={'#8884d8'} onClick={closeSettings} size={30} className={"close_modal_button"} />
                </div>
                <div className={"settings_modal_content"}>
                    <div className={"settings_top_tabs_container"}>
                        <div onClick={() => setShowSettings('General')} className={showSettings === "General" ? top_active : top_inactive}>General</div>
                        <div onClick={() => setShowSettings('Security')} className={showSettings === "Security" ? top_active : top_inactive}>Security</div>
                    </div>
                    <div className={"settings_tab_content"}>
                        {showSettings === 'General' ?
                            <div className={"settings_tab_rows"}>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>{"Username: " + username}</div>
                                    <button onClick={openUsername} className={change_button}>Change</button>
                                </div>
                                <br />
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Profile Picture: <img src={pfpMap[pfp]} alt="Profile Icon" className="settings_profile_picture" /></div>
                                    <button onClick={openChangePFP} className={change_button}>Change</button>
                                </div>
                            </div> :
                            <div>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Change Password</div>
                                    <button onClick={openChangePassword} className={change_button}>Change</button>
                                </div>
                                <br />
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Account Removal</div>
                                    <button onClick={openDeleteAccount} className={"delete_account_button"}>Delete Account</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {showChangeUsername && <ChangeUsername openError={openError} setErrorMessage={setErrorMessage} closeModal={closeUsername} changeUsername={changeUsername} />}
                {showChangePFP && <ChangePFP openError={openError} setErrorMessage={setErrorMessage} pfpMap={pfpMap} changePFP={changePFP} closeModal={closeChangePFP} />}
                {showChangePassword && <ChangePassword openError={openError} setErrorMessage={setErrorMessage} closeModal={closeChangePassword} />}
                {showDeleteAccount && <DeleteAccount openError={openError} setErrorMessage={setErrorMessage} deleteAccount={deleteAccount} closeModal={closeDeleteAccount} />}
            </div>
        </div>
    );
};

export default Settings;
