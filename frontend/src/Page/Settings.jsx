import React, { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
const Settings = ({closeSettings}) => {
    const [showSettings, setShowSettings] = useState('General');


    return (
        <div onClick={closeSettings} className={"settings_modal_bg_container"}>
            <div onClick={event => event.stopPropagation()} className={"settings_modal_container"}>
                <div className={"settings_modal_title_band"}>
                    <h2>Settings</h2>
                    <RiCloseLargeLine onClick={closeSettings} size={30} className={"close_modal_button"}/>
                </div>
                <div className={"divider_line"}></div>
                <div className={"settings_modal_content"}>
                    <div className={"settings_button_sidenav"}>
                        <button onClick={e => setShowSettings('General')}>General</button>
                        <button onClick={e => setShowSettings('Security')}>Security</button>
                    </div>
                    <div className={"settings_tab_content"}>
                        {showSettings === 'General' ?
                            <div>
                                <div>Change Username</div>
                                <br/>
                                <div>Change Profile Picture</div>
                            </div>:
                            <div>
                                <div>Change Password</div>
                                <br/>
                                <div>Delete Account</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;