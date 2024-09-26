import React, { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";

const ChangeUsername = ({ closeModal, changeUsername}) => {
    const [newUsername, setNewUsername] = useState('');

    const updateUsername = () => {
        changeUsername(newUsername);
        closeModal();
    }

    return (
      <div onClick={closeModal} className={"change_background"}>
          <div onClick={event => event.stopPropagation()} className={"change_modal_container"}>
              <div className={"change_form"}>
                  <div className={"label_container"}>
                      <label className={"change_label"}>New Username</label>
                  </div>
                  <input className={"change_field"} type={"text"} value={newUsername} onChange={e => setNewUsername(e.target.value)}/>
                  <button onClick={updateUsername} className={"change_button"}>Change</button>
              </div>
              <div className={"change_cancel"} onClick={closeModal}>Cancel</div>
          </div>
      </div>
    );
}
export default ChangeUsername;