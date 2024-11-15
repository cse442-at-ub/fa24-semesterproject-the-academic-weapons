// GraphSelectionModal.jsx
import React from 'react';
import '../../CSS Files/Dashboard Components/GraphSelectionModal.css';

const GraphSelectionModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Select a Chart Type</h3>
                <button onClick={() => onSelect('pie')}>Pie Chart</button>
                <button onClick={() => onSelect('bar')}>Bar Chart</button>
                <button onClick={() => onSelect('line')}>Line Chart</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default GraphSelectionModal;
