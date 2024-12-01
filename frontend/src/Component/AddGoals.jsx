import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import '../CSS Files/AddGoals.css';

const AddGoals = ({ closeModal, addGoal, maxGoalID, updateMaxGoalID }) => {
    const todayDate = new Date().toISOString().substr(0, 10);
    const [goalName, setGoalName] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(todayDate);
    const [category, setCategory] = useState('');
    const [newGoals, setNewGoals] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [costPlaceholder, setCostPlaceholder] = useState(''); // New state for placeholder

    const handleAddGoal = (e) => {
        e.preventDefault();
        setError('');
        setCostPlaceholder('');

        if (!goalName || !cost || !category) {
            setError('Name, Amount, Category, and Date are required.');
            return;
        }

        if (parseFloat(cost) < 0) {
            setCost('');
            setCostPlaceholder('Goal cannot be negative');
            return;
        }

        const newID = maxGoalID + 1;
        const addedGoal = {
            id: newID,
            name: goalName,
            cost: parseFloat(cost),
            date,
            category,
            allocated: 0
        };

        setNewGoals((prevGoals) => [...prevGoals, addedGoal]);
        updateMaxGoalID(newID);

        setGoalName('');
        setCost('');
        setDate(todayDate);
        setCategory('');
    };

    const handleSaveAndExit = () => {
        newGoals.forEach(goal => addGoal(goal));
        setMessage('Goals successfully added.');
        closeModal();
    };

    const deleteGoal = (goalID) => {
        const goal = newGoals.find((goal) => goal.id === goalID);
        if (window.confirm(`Are you sure you want to delete the goal: "${goal.name}"?`)) {
            setNewGoals((prevGoals) => prevGoals.filter(goal => goal.id !== goalID));
        }
    };

    return (
        <div className="add_goal_modal_container">
            <div className="add_goal_modal_container_inside">
                <div className="add_goal_input_form_container">
                    <h1 className="add_goal_title">Add Goal</h1>
                    {error && <p className="error-message">{error}</p>}
                    <form>
                        <div className="add_goal_form_input_group">
                            <label className="add_goal_input_label">Name<span className="required_field">*</span></label>
                            <input className="add_goal_input_field" value={goalName} type="text" required onChange={e => setGoalName(e.target.value)} />
                        </div>
                        <div className="add_goal_form_input_group">
                            <label className="add_goal_input_label">Amount<span className="required_field">*</span></label>
                            <input
                                className="add_goal_input_field"
                                value={cost}
                                type="number"
                                min="0"
                                placeholder={costPlaceholder || "Enter amount"} // Show error message or default placeholder
                                required
                                onChange={(e) => {
                                    setCost(e.target.value);
                                    setCostPlaceholder(''); // Clear placeholder when user starts typing
                                }}
                            />
                        </div>
                        <div className="add_goal_form_input_group">
                            <label className="add_goal_input_label">Category<span className="required_field">*</span></label>
                            <input className="add_goal_input_field" value={category} type="text" required onChange={e => setCategory(e.target.value)} />
                        </div>
                        <div className="add_goal_form_input_group">
                            <label className="add_goal_input_label">Date<span className="required_field">*</span></label>
                            <input className="add_goal_input_field" value={date} type="date" onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="add_goal_form_input_group">
                            <button type="submit" onClick={handleAddGoal} className="add_goal_add_btn">Add</button>
                        </div>
                    </form>
                </div>
                <div className="add_goal_added_box_container">
                    <h1 className="add_goal_title">Added Goals</h1>
                    <div className="add_goal_added_box">
                        {newGoals.length > 0 ? (
                            newGoals.map(goal => (
                                <div key={goal.id} className="add_goal_added_goal_item">
                                    <div className="add_goal_added_item_text">
                                        <div className="add_goal_added_text">{goal.name}</div>
                                        <div className="add_goal_added_text">{"$" + goal.cost}</div>
                                        <div className="add_goal_added_text">{goal.category}</div>
                                        <div className="add_goal_added_text">{goal.date}</div>
                                        <div onClick={() => deleteGoal(goal.id)}><MdDelete /></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no_content_text">No goals added yet.</p>
                        )}
                    </div>
                    {message && <p className="success-message">{message}</p>}
                    <div className={'add_goal_added_save_exit_container'}>
                        <button onClick={handleSaveAndExit} className={"add_goal_add_btn"}>Save and Exit</button>
                        <div className={"add_goal_close_text"} onClick={closeModal}>Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGoals;
