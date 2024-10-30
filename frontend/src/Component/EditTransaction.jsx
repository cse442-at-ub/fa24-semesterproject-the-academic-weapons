import React, { useEffect, useState } from "react";


const EditTransaction = ( {saveEditTransaction,  oldTransaction, closeModal } ) => {
    const [name, setName] = useState(oldTransaction.name);
    const [price, setPrice] = useState(oldTransaction.price);
    const [category, setCategory] = useState(oldTransaction.category);
    const [date, setDate] = useState(oldTransaction.date);
    const[recurring, setRecurring] = useState(oldTransaction.recurring);

    const handleUpdateTransaction = (e) => {
        const updated = {...oldTransaction};
        if (name.trim() === '' || price.trim() === '' || category.trim() === '' || date === null) return
        updated.name = name;
        updated.price = price;
        updated.category = category;
        updated.date = date;
        updated.recurring= recurring;
        saveEditTransaction(updated);
        closeModal();
    }


    return (
        <div onClick={closeModal} className={'edit_background'}>
            <div onClick={e => e.stopPropagation()} className={'edit_trans_modal_container'}>
                <h1 className={"edit_trans_title"}>Edit Transaction</h1>
                <div>
                    <div className={'edit_trans_form_input_group'}>
                        <label className={"edit_trans_input_label"}>Name<span
                            className={'required_field'}>*</span></label>
                        <input className={'edit_trans_input_field'} value={name} type={"text"} required={true}
                               onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className={'edit_trans_form_input_group'}>
                        <label className={"edit_trans_input_label"}>Price<span
                            className={'required_field'}>*</span></label>
                        <input className={'edit_trans_input_field'} value={price} type={'number'} required={true}
                               onChange={e => setPrice(e.target.value)}/>
                    </div>
                    <div className={'edit_trans_form_input_group'}>
                        <label className={"edit_trans_input_label"}>Category<span
                            className={'required_field'}>*</span></label>
                        <input className={'edit_trans_input_field'} value={category} type={"text"} required={true}
                               onChange={e => setCategory(e.target.value)}/>
                    </div>
                    <div className={'edit_trans_form_input_group'}>
                        <label className={"edit_trans_input_label"}>Date<span
                            className={'required_field'}>*</span></label>
                        <input className={'edit_trans_input_field'} value={date} type={"date"} required={true}
                               onChange={e => setDate(e.target.value)}/>
                    </div>
                    <div className={'edit_trans_form_input_group'}>
                        <label className={"edit_trans_input_label"}>Recurring Transaction?</label>
                        <input
                            type="checkbox"
                            checked={recurring}
                            onChange={(e) => setRecurring(e.target.checked)}
                            className={'edit_trans_checkbox'}
                        />
                    </div>
                    <div className={'edit_trans_form_input_group'}>
                        <button onClick={e => handleUpdateTransaction(e)}
                                className={"edit_trans_edit_btn"}>Update
                        </button>
                    </div>
                </div>
                <div className={"edit_trans_close_text"} onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
};

export default EditTransaction;