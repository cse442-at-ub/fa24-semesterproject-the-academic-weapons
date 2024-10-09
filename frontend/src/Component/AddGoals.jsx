import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import '../CSS Files/AddGoals.css';

const AddGoals = ({ closeModal, maxGoalID, updateMaxGoalID }) => {
    const todayDate = new Date().toISOString().substr(0, 10);
    const [goalName, setGoalName] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(todayDate);
    const [goals, setGoals] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php?id=${userID}&token=${userToken}`);
            const result = await response.json();

            if (result.success) {
                setGoals(result.goals);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred while fetching goals.');
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        setError('');
        if (!goalName || !cost) {
            setError('Goal name and cost are required.');
            return;
        }

        const newGoal = { name: goalName, cost: parseFloat(cost), date };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: userID,
                    userToken: userToken,
                    goal: newGoal,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Update local state after successfully adding the goal to the backend
                const newID = maxGoalID + 1;
                const addedGoal = { id: newID, ...newGoal };
                setGoals([...goals, addedGoal]);
                updateMaxGoalID(newID);
                setGoalName('');
                setCost('');
                setDate(todayDate);
                setMessage('Goal successfully added.');
            } else {
                setError(result.message || 'An error occurred while adding the goal.');
            }
        } catch (error) {
            console.error('Error adding goal:', error);
            setError('An error occurred while trying to add the goal.');
        }
    };

    const deleteGoal = async (goalID) => {
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: userID,
                    userToken: userToken,
                    goalID: goalID,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setGoals(goals.filter(goal => goal.id !== goalID));
                setMessage('Goal successfully deleted.');
            } else {
                setError(result.message || 'An error occurred while deleting the goal.');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            setError('An error occurred while trying to delete the goal.');
        }
    };

    return (
        <div className={"add_goal_modal_container"}>
            <div className={"add_goal_modal_container_inside"}>
                <div className={"add_goal_input_form_container"}>
                    <h1 className={"add_goal_title"}>Add Goal</h1>
                    <form onSubmit={handleAddGoal}>
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
                            <button type="submit" className={"add_goal_add_btn"}>Add</button>
                        </div>
                    </form>
                    <div className={"add_goal_close_text"} onClick={closeModal}>Cancel</div>
                </div>
                <div className={'add_goal_added_box_container'}>
                    <h1 className={'add_goal_title'}>Added Goals</h1>
                    <div className={'add_goal_added_box'}>
                        {goals.map(goal => (
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
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <div className={'add_goal_added_save_exit_container'}>
                        <button onClick={closeModal} className={"add_goal_add_btn"}>Save and Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGoals;