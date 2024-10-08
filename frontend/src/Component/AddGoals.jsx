import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import '../CSS Files/AddGoals.css';

const AddGoal = ({ closeModal, addGoal, removeGoal, maxGoalID, updateMaxGoalID }) => {
    const todayDate = new Date().toISOString().substr(0, 10);
    const [goalName, setGoalName] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(todayDate);
    const [newGoals, setNewGoals] = useState([]);

    const handleAddGoal = (e) => {
        e.preventDefault();
        const newID = maxGoalID + 1;
        const newGoal = { id: newID, name: goalName, cost, date };
        setNewGoals([...newGoals, newGoal]);
        updateMaxGoalID(newID);
        setGoalName('');
        setCost('');
        setDate(todayDate);
    };

    const handleSaveAndExit = () => {
        newGoals.forEach(goal => addGoal(goal));
        closeModal();
    };

    const deleteGoal = (delID) => {
        const updatedGoals = newGoals.filter(goal => goal.id !== delID);
        setNewGoals(updatedGoals);
    };

    return (
        <div className={"add_goal_modal_container"}>
            <div className={"add_goal_modal_container_inside"}>
                <div className={"add_goal_input_form_container"}>
                    <h1 className={"add_goal_title"}>Add Goal</h1>
                    <form>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Name<span className={'required_field'}>*</span></label>
                            <input className={'add_goal_input_field'} type="text" value={goalName} required onChange={e => setGoalName(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Cost<span className={'required_field'}>*</span></label>
                            <input className={'add_goal_input_field'} type="number" value={cost} required onChange={e => setCost(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <label className={"add_goal_input_label"}>Date</label>
                            <input className={'add_goal_input_field'} type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className={'add_goal_form_input_group'}>
                            <button type="submit" className={"add_goal_add_btn"} onClick={handleAddGoal}>Add</button>
                        </div>
                    </form>
                    <div className={"add_goal_close_text"} onClick={closeModal}>Cancel</div>
                </div>
                <div className={'add_goal_added_box_container'}>
                    <h1 className={'add_goal_title'}>Added Goals</h1>
                    <div className={'add_goal_added_box'}>
                        {newGoals.map(goal => (
                            <div key={goal.id} className={'add_goal_added_goal_item'}>
                                <div className={'add_goal_added_item_text'}>
                                    <div className={'add_goal_added_text'}>{goal.name}</div>
                                    <div className={'add_goal_added_text'}>{"$" + goal.cost}</div>
                                    <div className={'add_goal_added_text'}>{goal.date}</div>
                                    <div onClick={() => deleteGoal(goal.id)}><MdDelete /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={'add_goal_added_save_exit_container'}>
                        <button onClick={handleSaveAndExit} className={"add_goal_add_btn"}>Save and Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGoal;
