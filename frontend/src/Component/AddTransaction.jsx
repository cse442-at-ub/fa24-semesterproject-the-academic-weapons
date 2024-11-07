import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Creatable, { useCreatable } from 'react-select/creatable';

const AddTransaction = ({ transactions, closeModal, addTransaction, maxTransID, updateMaxTransID }) => {
    const todayDate = new Date().toISOString().substr(0,10)
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(todayDate);
    const [recurring, setRecurring] = useState(false);
    const [newTransactions, setNewTransactions] = useState([]);
    const uniqueNames = Array.from(new Set(transactions.map(item => item.name)));
    const nameOptions = uniqueNames.map(name => ({
        label: name,
        value: name
    }));
    const uniqueCategories = Array.from(new Set(transactions.map(item => item.category)));
    const categoryOptions = uniqueCategories.map(category => ({
        label: category,
        value: category
    }));

    useEffect(() => { }, [newTransactions]);

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (name.value.trim() === '' || price.trim() === '' || category.value.trim() === '' || date === name) return;
        const addNewTrans = [...newTransactions];
        const newID = maxTransID + 1;
        addNewTrans.push({ "id": newID, "name": name.value, "price": price, "category": category.value, "date": date, "recurring": recurring });
        updateMaxTransID(newID);
        setNewTransactions(addNewTrans);
        setName('');
        setPrice('');
        setCategory('');
        setRecurring(false);
        setDate(todayDate);
    };

    const handleSaveAndExit = () => {
        newTransactions.forEach(item => addTransaction(item));
        closeModal();
    }

    const deleteTransaction = (delID) => {
        const delTrans = [...newTransactions];
        const index = delTrans.findIndex(trans => trans.id === delID);
        delTrans.splice(index, 1);
        setNewTransactions(delTrans);
    };

    const handleSetCategory = (option) => {
        setCategory(option);
    };

    const handleSetName = (option) => {
        setName(option)
    }

    return (
        <div className={"add_trans_modal_container"}>
            <div className={"add_trans_modal_container_inside"}>
                <div className={"add_trans_input_form_container"}>
                    <h1 className={"add_trans_title"}>Add Transaction</h1>
                    <form>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Name<span className={'required_field'}>*</span></label>
                            <Creatable
                                value={name}
                                options={nameOptions}
                                onChange={handleSetName}
                                // className={'add_trans_input_field'}
                                required={true}
                            />
                            {/*<input*/}
                            {/*    className={'add_trans_input_field'}*/}
                            {/*    value={name}*/}
                            {/*    type={"text"}*/}
                            {/*    required={true}*/}
                            {/*    onChange={e => setName(e.target.value)}*/}
                            {/*/>*/}
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Price<span className={'required_field'}>*</span></label>
                            <input
                                className={'add_trans_input_field'}
                                value={price}
                                type={'number'}
                                required={true}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Category<span className={'required_field'}>*</span></label>
                            <Creatable
                                value={category}
                                options={categoryOptions}
                                onChange={handleSetCategory}
                                // className={'add_trans_input_field'}
                                required={true}
                            />
                            {/*<input*/}
                            {/*    className={'add_trans_input_field'}*/}
                            {/*    value={category}*/}
                            {/*    required={true}*/}
                            {/*    type={"text"}*/}
                            {/*    onChange={e => setCategory(e.target.value)}*/}
                            {/*/>*/}
                        </div>
                        <div className={'add_trans_form_input_group'}>
                            <label className={"add_trans_input_label"}>Date<span className={'required_field'}>*</span></label>
                            <input
                                className={'add_trans_input_field'}
                                value={date}
                                required={true}
                                type={"date"}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        {/* Recurring Transaction Checkbox */}
                        <div className={'add_trans_recurring_group'}>
                            <label className={'add_trans_recurring_label'}>Recurring Transaction?</label>
                            <input
                                type="checkbox"
                                checked={recurring}
                                onChange={e => setRecurring(e.target.checked)}
                                className={'add_trans_recurring_checkbox'}
                            />
                        </div>
                        {/* End of Recurring Transaction Checkbox */}

                        <div className={'add_trans_form_input_group'}>
                            <button
                                type={"submit"}
                                onClick={handleAddTransaction}
                                className={"add_trans_add_btn"}
                            >
                                Add
                            </button>
                        </div>
                    </form>
                    <div className="add_trans_close_text_container">
                        <div className={"add_trans_close_text"} onClick={closeModal}>Cancel</div>
                    </div>
                </div>
                <div className={'add_trans_added_box_container'}>
                    <h1 className={'add_trans_title'}>Added</h1>
                    <div className={'add_trans_added_box'}>

                        {newTransactions.length > 0 ? (
                            (newTransactions.map(transaction => (

                            <div key={transaction.id} className={'add_trans_added_transaction_item'}>
                                <div className={'add_trans_added_item_text'}>
                                    <div className={'add_trans_added_text'}>{transaction.name}</div>
                                    <div className={'add_trans_added_text'}>{"$" + transaction.price}</div>
                                    <div className={'add_trans_added_text'}>{transaction.category}</div>
                                    <div className={'add_trans_added_text'}>{transaction.date}</div>
                                    {transaction.recurring && (
                                        <div className={'add_trans_added_text'}>Recurring</div>
                                    )}
                                    <div onClick={() => deleteTransaction(transaction.id)}>
                                        <MdDelete />
                                    </div>
                                </div>
                            </div>
                                ))
                            )): (
                            <p className={"no_content_text"}>No transactions added yet.</p>
                            )}
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
