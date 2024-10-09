import React, { useState, useEffect } from 'react';
import AddGoal from '../AddGoals.jsx'; // Import the new modal component
import '../../CSS Files/Dashboard Components/Goals.css';
import {MdDelete} from "react-icons/md";

const GoalsList = ({ deleteGoal }) => {
    const [showAddGoalModal, setShowAddGoalModal] = useState(false);
    const [goalsState, setGoalsState] = useState([]);
    const [maxGoalID, setMaxGoalID] = useState(0);

    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token');

    useEffect(() => {
        const interval = setInterval(() => {
            fetchGoals();
        }, 5000); // Fetch goals every 5 seconds

        fetchGoals(); // Initial fetch

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php?id=${userID}&token=${userToken}`);
            const result = await response.json();

            if (result.success) {
                setGoalsState(result.goals);
                setMaxGoalID(result.goals.length > 0 ? Math.max(...result.goals.map(g => g.id)) : 0);
            } else {
                console.error(result.message);
            }
        } catch (err) {
            console.error('An error occurred while fetching goals:', err);
        }
    };

    const addGoal = (newGoal) => {
        setGoalsState(prevGoals => [...prevGoals, newGoal]);
    };

    const openGoalModal = () => {
        setShowAddGoalModal(true);
    };

    const closeGoalModal = () => {
        setShowAddGoalModal(false);
    };

    const handleDeleteGoal = (goalId) => {
        deleteGoal(goalId);
        setGoalsState(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    };

    return (
        <div className="goals-list">
            <div className="goals-header">
                <h2>Goals</h2>
                <button className="add-button" onClick={openGoalModal}>
                    Add Goal
                </button>
            </div>
            {showAddGoalModal && (
                <AddGoal
                    closeModal={closeGoalModal}
                    addGoal={addGoal}
                    maxGoalID={maxGoalID}
                    updateMaxGoalID={setMaxGoalID}
                />
            )}
            <div className="goals-list-content">
                {goalsState.length === 0 ? (
                    <h3>No goals added yet.</h3>
                ) : (
                    goalsState.map((goal) => (
                        <div className="goal-item" key={goal.id}>
                            <span>{goal.name}</span>
                            <span>{"$" + goal.cost}</span>
                            <span>{goal.date}</span>
                            <span onClick={() => handleDeleteGoal(goal.id)} className="delete-goal"><MdDelete /></span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GoalsList;