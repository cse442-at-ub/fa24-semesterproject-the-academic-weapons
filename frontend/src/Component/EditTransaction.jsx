import React, { useEffect, useState } from "react";


const EditTransaction = ( { oldTransaction, closeModal } ) => {
    const [name, setName] = useState(oldTransaction.name);
    const [price, setPrice] = useState(oldTransaction.price);
    const [category, setCategory] = useState(oldTransaction.category);
    const [date, setDate] = useState(oldTransaction.date);

    const handleUpdateTransaction = (e) => {

    }


    return (
        <div className={'edit_transaction_container'}>
            <div className={"add_trans_input_form_container"}>
                <h1 className={"add_trans_title"}>Edit Transaction</h1>
                <form>
                    <div className={'add_trans_form_input_group'}>
                        <label className={"add_trans_input_label"}>Name<span
                            className={'required_field'}>*</span></label>
                        <input className={'add_trans_input_field'} value={name} type={"text"} required={true}
                               onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className={'add_trans_form_input_group'}>
                        <label className={"add_trans_input_label"}>Price<span
                            className={'required_field'}>*</span></label>
                        <input className={'add_trans_input_field'} value={price} type={'number'} required={true}
                               onChange={e => setPrice(e.target.value)}/>
                    </div>
                    <div className={'add_trans_form_input_group'}>
                        <label className={"add_trans_input_label"}>Category</label>
                        <input className={'add_trans_input_field'} value={category} type={"text"}
                               onChange={e => setCategory(e.target.value)}/>
                    </div>
                    <div className={'add_trans_form_input_group'}>
                        <label className={"add_trans_input_label"}>Date</label>
                        <input className={'add_trans_input_field'} value={date} type={"date"}
                               onChange={e => setDate(e.target.value)}/>
                    </div>
                    <div className={'add_trans_form_input_group'}>
                        <button type={"submit"} onClick={e => handleUpdateTransaction(e)}
                                className={"add_trans_add_btn"}>Add
                        </button>
                    </div>
                </form>
                <div className={"add_trans_close_text"} onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
};

export default EditTransaction;