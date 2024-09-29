import React from "react"


const ChangePFP = ( { closeModal, changePFP } ) => {

    return (
        <div onClick={closeModal} className={"change_background"}>
            <div onClick={e => e.stopPropagation()} className={"change_modal_container"}>
                <div className={"change_modal_title_desc_container"}>
                    <h2>Change Profile Picture</h2>
                    <div className={"change_modal_desc"}>Choose a new profile picture</div>
                </div>
            </div>
        </div>
    )
}

export default ChangePFP;