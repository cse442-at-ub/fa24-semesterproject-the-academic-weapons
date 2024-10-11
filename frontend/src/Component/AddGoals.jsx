import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import '../CSS Files/AddGoals.css';

const AddGoals = ({ closeModal, addGoal, maxGoalID, updateMaxGoalID }) => {
    const todayDate = new Date().toISOString().substr(0, 10);
    const [goalName, setGoalName] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(todayDate);
    const [newGoals, setNewGoals] = useState([]); // Local state to store newly added goals
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle adding a new goal locally
    const handleAddGoal = (e) => {
        e.preventDefault();
        setError(''); // Clear existing error messages

        // Validate required fields
        if (!goalName || !cost) {
            setError('Goal name and cost are required.');
            return;
        }

        // Create a new ID for the new goal
        const newID = maxGoalID + 1;
        // Create a new goal object
        const addedGoal = {
            id: newID,
            name: goalName,
            cost: parseFloat(cost), // Convert cost to a number
            date
        };

        // Update the goals state with the new goal
        setNewGoals((prevGoals) => [...prevGoals, addedGoal]);
        // Update the max goal ID
        updateMaxGoalID(newID);

        // Clear the input fields
        setGoalName('');
        setCost('');
        setDate(todayDate);
    };


    // Save goals to the backend and exit the modal
    const handleSaveAndExit = () => {
        newGoals.forEach(goal => addGoal(goal)); // Call the prop function to save the goals
        setMessage('Goals successfully added.');
        closeModal(); // Close the modal after saving
    };

    // Delete goal from the local state
    const deleteGoal = (goalID) => {
        setNewGoals((prevGoals) => prevGoals.filter(goal => goal.id !== goalID));
    };

    return (
        <div className={"add_goal_modal_container"}>
            <div className={"add_goal_modal_container_inside"}>
                <div className={"add_goal_input_form_container"}>
                    <h1 className={"add_goal_title"}>Add Goal</h1>
                    <form>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Name<span className={'required_field'}>*</span></label>
                            <input className={'add_goal_input_field'} value={goalName} type={"text"} required={true} onChange={e => setGoalName(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Cost<span className={'required_field'}>*</span></label>
                            <input className={'add_goal_input_field'} value={cost} type={'number'} required={true} onChange={e => setCost(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Date</label>
                            <input className={'add_goal_input_field'} value={date} type={"date"} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <button type={"submit"} onClick={handleAddGoal} className={"add_goal_add_btn"}>Add</button>
                        </div>
                    </form>
                    <div className={"add_goal_close_text"} onClick={closeModal}>Cancel</div>
                </div>
                <div className={'add_goal_added_box_container'}>
                    <h1 className={'add_goal_title'}>Added Goals</h1>
                    <div className={'add_goal_added_box'}>
                        {newGoals.length > 0 ? (
                            newGoals.map(goal => (
                                <div key={goal.id} className={'add_goal_added_goal_item'}>
                                    <div className={'add_goal_added_item_text'}>
                                        <div className={'add_goal_added_text'}>{goal.name}</div>
                                        <div className={'add_goal_added_text'}>{"$" + goal.cost}</div>
                                        <div className={'add_goal_added_text'}>{goal.date}</div>
                                        <div onClick={() => deleteGoal(goal.id)}><MdDelete /></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No goals added yet.</p>
                        )}
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <div className={'add_goal_added_save_exit_container'}>
                        <button onClick={handleSaveAndExit} className={"add_goal_add_btn"}>Save and Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGoals;
