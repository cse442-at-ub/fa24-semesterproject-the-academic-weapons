import React, { useEffect, useState } from "react";
const AddTransaction = ({closeModal, addTransaction, removeTransaction}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const todayDate = new Date().toISOString().substr(0,10)


    return (
        <div className={"add_trans_modal_container"}>
            <div className={"add_trans_modal_container_inside"}>
                <div className={"add_trans_input_form_container"}>
                    <h1 className={"add_trans_title"}>Add Transaction</h1>
                    <form>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Name<span className={'required_field'}>*</span></label>
                            <input className={'add_trans_input_field'} type={"text"} required={true} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Price<span className={'required_field'}>*</span></label>
                            <input className={'add_trans_input_field'} type={'number'} required={true} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Category</label>
                            <input className={'add_trans_input_field'} type={"text"} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Date</label>
                            <input className={'add_trans_input_field'} defaultValue={todayDate} type={"date"} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <button className={"add_trans_add_btn"}>Add</button>
                        </div>
                    </form>
                    <div className={"add_trans_close_text"} onClick={closeModal}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;