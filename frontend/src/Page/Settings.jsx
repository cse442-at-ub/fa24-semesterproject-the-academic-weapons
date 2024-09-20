import React, { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
const Settings = ({closeSettings}) => {


  return (
      <div onClick={closeSettings} className={"settings_modal_bg_container"}>
        <div onClick={event => event.stopPropagation()} className={"settings_modal_container"}>
            <div className={"settings_modal_title_band"}>
                <h2>Settings</h2>
                <RiCloseLargeLine onClick={closeSettings} size={30} className={"close_modal_button"}/>
            </div>

            <div>Hello</div>
        </div>
      </div>
  );
};

export default Settings;