import React from "react"


const ChangePFP = ( { closeModal, changePFP, pfpMap } ) => {

    const setNewPFP = (e) => {
        changePFP(e);
        closeModal();
    }

    return (
        <div onClick={closeModal} className={"change_background"}>
            <div onClick={e => e.stopPropagation()} className={"change_modal_container"}>
                <div className={"change_modal_title_desc_container"}>
                    <h2>Change Profile Picture</h2>
                    <div className={"change_modal_desc"}>Choose a profile picture</div>
                </div>
                <div className={"change_pfp_options_container"}>
                    {Object.values(pfpMap).map((pic, index) =>
                    <div onClick={e => setNewPFP(index)} className={"profile_picture_container"} key={index}>
                        <img className={"profile_picture_option"} src={pic} alt={"Profile picture option " + index}/>
                    </div>
                    )}
                </div>
                <div className={"change_cancel"} onClick={closeModal}>Cancel</div>
            </div>
        </div>
    )
}

export default ChangePFP;