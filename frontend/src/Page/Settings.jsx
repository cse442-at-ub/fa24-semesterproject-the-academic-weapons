import React, { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import person1 from "../Assets/Profile Pictures/Person1.svg";
import ChangeUsername from "../Component/Settings Components/ChangeUsername";
import ChangePFP from "../Component/Settings Components/ChangePFP.jsx";
const Settings = ({closeSettings, pfpMap, changePFP, pfp, username, changeUsername}) => {
    const active = 'settings_button_active';
    const inactive = 'settings_button_inactive';
    const top_active = "settings_top_tab_button_active"
    const top_inactive = "settings_top_tab_button_inactive"
    const change_button = 'settings_tab_row_button'
    const [showSettings, setShowSettings] = useState('General');
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [showChangePFP, setShowChangePFP] = useState(false);

    const openUsername = () => {
        setShowChangeUsername(true);
    }

    const closeUsername = () => {
        setShowChangeUsername(false);
    }

    const openChangePFP = () => {
        setShowChangePFP(true);
    }

    const closeChangePFP = () => {
        setShowChangePFP(false)
    }

    return (
        <div onClick={closeSettings} className={"settings_modal_bg_container"}>
            <div onClick={event => event.stopPropagation()} className={"settings_modal_container"}>
                <div className={"settings_modal_title_band"}>
                    <h2>Settings</h2>
                    <RiCloseLargeLine color={'#8884d8'} onClick={closeSettings} size={30} className={"close_modal_button"}/>
                </div>
                <div className={"settings_modal_content"}>
                    <div className={"settings_top_tabs_container"}>
                        <div onClick={e => setShowSettings('General')} className={showSettings === "General" ? top_active:top_inactive}>General</div>
                        <div onClick={e => setShowSettings('Security')} className={showSettings === "Security" ? top_active:top_inactive}>Security</div>
                    </div>
                    <div className={"settings_tab_content"}>
                        {showSettings === 'General' ?
                            <div className={"settings_tab_rows"}>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>{"Username: "+username}</div>
                                    <button onClick={openUsername} className={change_button}>Change</button>
                                </div>
                                <br/>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Profile Picture: <img src={pfpMap[pfp]} alt="Profile Icon" className="settings_profile_picture" /></div>
                                    <button onClick={openChangePFP} className={change_button}>Change</button>
                                </div>
                            </div>:
                            <div>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Change Password</div>
                                    <button className={change_button}>Change</button>
                                </div>
                                <br/>
                                <div className={"settings_tab_row"}>
                                    <div className={"settings_change_label"}>Account Removal</div>
                                    <button className={"delete_account_button"}>Delete Account</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {showChangeUsername ? <ChangeUsername closeModal={closeUsername} changeUsername={changeUsername}/>:null}
                {showChangePFP ? <ChangePFP pfpMap={pfpMap} changePFP={changePFP} closeModal={closeChangePFP} changeUsername={changePFP}/>:null}
            </div>
        </div>
    );
};

export default Settings;