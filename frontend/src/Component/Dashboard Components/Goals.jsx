import React, { useState } from 'react';
import AddGoal from '../AddGoals.jsx'; // Import the new modal component
import '../../CSS Files/Dashboard Components/Goals.css';

const GoalsList = ({ goals, deleteGoal }) => {
    const [showAddGoalModal, setShowAddGoalModal] = useState(false);
    const [maxGoalID, setMaxGoalID] = useState(goals.length > 0 ? Math.max(...goals.map(g => g.id)) : 0);

    const addGoal = (newGoal) => {
        console.log('Goal added:', newGoal);
    };

    const openGoalModal = () => {
        setShowAddGoalModal(true);
    };

    const closeGoalModal = () => {
        setShowAddGoalModal(false);
    };

    const handleDeleteGoal = (goalId) => {
        deleteGoal(goalId);
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
                    removeGoal={deleteGoal} 
                    maxGoalID={maxGoalID} 
                    updateMaxGoalID={setMaxGoalID}
                />
            )}
            <div className="goals-list-content">
                {goals.length === 0 ? (
                    <h3>No goals added yet.</h3>
                ) : (
                    goals.map((goal) => (
                        <div className="goal-item" key={goal.id}>
                            <span>{goal.name}</span>
                            <span>{"$" + goal.cost}</span>
                            <span>{goal.date}</span>
                            <span onClick={() => handleDeleteGoal(goal.id)}>Delete</span> {/* call local handler ? */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GoalsList;
