import React, { useEffect, useState } from "react";
const AddTransaction = ({closeModal, addTransaction, removeTransaction}) => {
    const todayDate = new Date().toISOString().substr(0,10)
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(todayDate);
    const [newTransactions, setNewTransactions] = useState([])

    const handleAddTransaction = (e) => {
        e.preventDefault();
        const addNewTrans = newTransactions;
        addNewTrans.push({"name": name, "price": price, "category": category, "date": date});
        setNewTransactions(addNewTrans)
        setName('')
        setPrice('')
        setCategory('')
        setDate(todayDate)
    }


    const handleSaveAndExit = () => {
        newTransactions.forEach(item => addTransaction(item));
        closeModal();
    }


    return (
        <div className={"add_trans_modal_container"}>
            <div className={"add_trans_modal_container_inside"}>
                <div className={"add_trans_input_form_container"}>
                    <h1 className={"add_trans_title"}>Add Transaction</h1>
                    <form>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Name<span className={'required_field'}>*</span></label>
                            <input className={'add_trans_input_field'} value={name} type={"text"} required={true} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Price<span className={'required_field'}>*</span></label>
                            <input className={'add_trans_input_field'} value={price} type={'number'} required={true} onChange={e => setPrice(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Category</label>
                            <input className={'add_trans_input_field'} value={category} type={"text"} onChange={e => setCategory(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Date</label>
                            <input className={'add_trans_input_field'} value={date} defaultValue={todayDate} type={"date"} onChange={e => setDate(e.target.value)}/>
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <button type={"submit"} onClick={e => handleAddTransaction(e)} className={"add_trans_add_btn"}>Add</button>
                        </div>
                    </form>
                    <div className={"add_trans_close_text"} onClick={closeModal}>Cancel</div>
                </div>
                <div className={'add_trans_added_box_container'}>
                    <h1 className={'add_trans_title'}>Added</h1>
                    <div className={'add_trans_added_box'}>
                        {newTransactions.map((transaction, index) => (
                            <div key={index} className={'add_trans_added_transaction_item'}>
                                <div className={'add_trans_added_item_text'}>
                                    <div className={'add_trans_added_text'}>{transaction.name}</div>
                                    <div className={'add_trans_added_text'}>{"$"+transaction.price}</div>
                                    <div className={'add_trans_added_text'}>{transaction.category}</div>
                                    <div className={'add_trans_added_text'}>{transaction.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={'add_trans_added_save_exit_container'}>
                        <button onClick={handleSaveAndExit} className={"add_trans_add_btn"}>Save and Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;