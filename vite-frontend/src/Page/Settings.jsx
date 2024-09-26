import React, { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import person1 from "../Assets/Profile Pictures/Person1.svg";
import ChangeUsername from "../Component/Settings Components/ChangeUsername";
const Settings = ({closeSettings}) => {
    const active = 'settings_button_active';
    const inactive = 'settings_button_inactive';
    const change_button = 'settings_tab_row_button'
    const [showSettings, setShowSettings] = useState('General');
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [username, setUsername] = useState('JourneySpratt')

    const openUsername = () => {
        setShowChangeUsername(true);
    }

    const closeUsername = () => {
        setShowChangeUsername(false);
    }

    const changeUsername = (e) => {
        setUsername(e)
    }


    return (
        <div onClick={closeSettings} className={"settings_modal_bg_container"}>
            <div onClick={event => event.stopPropagation()} className={"settings_modal_container"}>
                <div className={"settings_modal_title_band"}>
                    <h2>Settings</h2>
                    <RiCloseLargeLine color={'#8884d8'} onClick={closeSettings} size={30} className={"close_modal_button"}/>
                </div>
                <div className={"divider_line"}></div>
                <div className={"settings_modal_content"}>
                    <div className={"settings_button_sidenav"}>
                        <button className={showSettings === 'General' ? active:inactive} onClick={e => setShowSettings('General')}>General</button>
                        <button className={showSettings === 'Security' ? active:inactive} onClick={e => setShowSettings('Security')}>Security</button>
                    </div>
                    <div className={"settings_tab_content"}>
                        {showSettings === 'General' ?
                            <div className={"settings_tab_rows"}>
                                <div className={"settings_tab_row"}>
                                    <div>{"Current Username: "+username}</div>
                                    <button onClick={openUsername} className={change_button}>Change</button>
                                </div>
                                <br/>
                                <div className={"settings_tab_row"}>
                                    <div>Current Profile Picture: <img src={person1} alt="Profile Icon" className="settings_profile_picture" /></div>
                                    <button className={change_button}>Change</button>
                                </div>
                            </div>:
                            <div>
                                {/*<div className={"settings_tab_row"}>*/}
                                {/*    <div>Change Password</div>*/}
                                {/*    <button className={change_button}>Change</button>*/}
                                {/*</div>*/}
                                {/*<br/>*/}
                                <div className={"settings_tab_row"}>
                                    <div>Delete Account</div>
                                    <button className={"delete_account_button"}>Delete</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {showChangeUsername ? <ChangeUsername closeModal={closeUsername} changeUsername={changeUsername}/>:null}
            </div>
        </div>
    );
};

export default Settings;