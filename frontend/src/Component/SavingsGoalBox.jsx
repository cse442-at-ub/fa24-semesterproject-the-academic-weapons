import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const SavingsGoalModal = ({ totalContributed, savingsGoal, onClose, handleEditGoal }) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((totalContributed / savingsGoal) * 100, 100);

  // Dynamically change the progress bar color to green as goal progresses
  const getGreenShade = () => {
    // Gradually change green color as progress increases
    const greenValue = Math.min(Math.round(150 + progressPercentage * 1.05), 255); // Increase greenValue based on progress
    return `rgb(0, ${greenValue}, 0)`; // More green as progress increases
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2 className="savings-title">Monthly Savings Goal</h2>

        <div className="progress-labels">
          <span className="left-label">${totalContributed}</span>
          <span className="right-label">${savingsGoal}</span>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: getGreenShade(),
            }}
          />
        </div>

        <p className="savings-text">{`${progressPercentage.toFixed(2)}% of $${savingsGoal} saved`}</p>
        <button className="edit-goal-btn" onClick={handleEditGoal}>
          <FaEdit /> Edit Goal
        </button>
      </div>
    </div>
  );
};

export default SavingsGoalModal;