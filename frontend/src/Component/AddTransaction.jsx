import React, { useEffect, useState } from "react";
const AddTransaction = ({closeModal}) => {


    return (
        <div className={"add_trans_modal_container"}>
            <div className={"add_trans_modal_container_inside"}>
            <h1>Add Transaction</h1>
            <div>Hello</div>
            <button onClick={closeModal}>Close</button>
                </div>
        </div>
    );
}

export default AddTransaction;