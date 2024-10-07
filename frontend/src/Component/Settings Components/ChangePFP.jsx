import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";


const ChangePFP = ( { closeModal, changePFP, pfpMap } ) => {
    const navigate = useNavigate();
    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token')

    useEffect(() => {

        if (!userID || !userToken) {
            sessionStorage.removeItem('User');
            navigate('/')
            window.location.reload();
        }

    })

    const savePFP = async (pfp) => {
        let url = `${import.meta.env.VITE_API_PATH}/routes/change_profile.php`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({pfp, userID, userToken}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (!data.auth) {
            alert("Invalid user credentials, please sign in again...")
            sessionStorage.clear()
            window.location.reload()
            return
        }

        if (!data.success) {
            alert(data.message || 'Saving new profile picture failed!');
        }
    }

    const newPFP = (e) => {
        changePFP(e);
        savePFP(e)
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
                    <div onClick={e => newPFP(index)} className={"profile_picture_container"} key={index}>
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