import React, { useState } from 'react';

const MessagePopup = ( { message, closeModal } ) => {
    return (
        <div className={'edit_background'}>
            <div className={'notice_container'}>
                <h1 className={"notice_title"}>Notice</h1>
                <div className={"notice_text"}>{message}</div>
                <div className={"edit_trans_close_text"} onClick={closeModal}>Dismiss</div>
            </div>
        </div>
    )
}

export default MessagePopup;