import React, { useEffect, useState } from "react";

const EditGoal = ({ saveEditGoal, oldGoal, closeModal }) => {
    const [name, setName] = useState(oldGoal.name);
    const [price, setPrice] = useState(parseFloat(oldGoal.cost));
    const [category, setCategory] = useState(oldGoal.category);
    const [date, setDate] = useState(oldGoal.date);
    const oldAllocated = oldGoal.allocated;
    const [pricePlaceholder, setPricePlaceholder] = useState(''); // New state for placeholder

    const handleUpdateGoal = (e) => {
        e.preventDefault();
        const updated = { ...oldGoal };
        setPricePlaceholder(''); // Reset placeholder

        // Ensure all fields are filled out
        if (name.trim() === '' || price === '' || category.trim() === '' || date === null) return;

        // Validate for non-negative price
        if (parseFloat(price) < 0) {
            setPrice(''); // Clear the field
            setPricePlaceholder('Goal cannot be negative'); // Show placeholder
            return;
        }

        updated.name = name;
        updated.cost = parseFloat(price);

        // Adjust `allocated` if new cost is less than allocated amount
        updated.allocated = price < oldAllocated ? parseFloat(price) : oldAllocated;

        updated.category = category;
        updated.date = date;
        saveEditGoal(updated);
        closeModal();
    };

    return (
        <div onClick={closeModal} className={'edit_background'}>
            <div onClick={e => e.stopPropagation()} className={'edit_trans_modal_container'}>
                <h1 className={"edit_trans_title"}>Edit Goal</h1>
                <div>
                    <div className="edit_trans_form_input_group">
                        <label className="edit_trans_input_label">Name<span className="required_field">*</span></label>
                        <input
                            className="edit_trans_input_field"
                            value={name}
                            type="text"
                            required
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="edit_trans_form_input_group">
                        <label className="edit_trans_input_label">Amount<span className="required_field">*</span></label>
                        <input
                            className="edit_trans_input_field"
                            value={price}
                            type="number"
                            min="0" // Prevents negative values
                            placeholder={pricePlaceholder || "Enter amount"} // Show error message or default placeholder
                            required
                            onChange={e => {
                                setPrice(e.target.value);
                                setPricePlaceholder(''); // Clear placeholder when user starts typing
                            }}
                        />
                    </div>
                    <div className="edit_trans_form_input_group">
                        <label className="edit_trans_input_label">Category<span className="required_field">*</span></label>
                        <input
                            className="edit_trans_input_field"
                            value={category}
                            type="text"
                            required
                            onChange={e => setCategory(e.target.value)}
                        />
                    </div>
                    <div className="edit_trans_form_input_group">
                        <label className="edit_trans_input_label">Date<span className="required_field">*</span></label>
                        <input
                            className="edit_trans_input_field"
                            value={date}
                            type="date"
                            required
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                    <div className="edit_trans_form_input_group">
                        <button onClick={handleUpdateGoal} className="edit_trans_edit_btn">Update</button>
                    </div>
                </div>
                <div className="edit_trans_close_text" onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
};

export default EditGoal;
