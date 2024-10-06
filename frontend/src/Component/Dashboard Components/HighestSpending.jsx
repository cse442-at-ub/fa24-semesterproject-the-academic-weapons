import React from 'react';
import '../../CSS Files/Dashboard Components/HighestSpending.css';

const HighestSpending = () => {
  return (
    <div className="highest-spending">
      
      <h2>Highest Spending Category</h2>
      <div className="high_spend_container">
        {/* Static text for now, can be dynamic but truncate there words cuz how dare they make it so long >: (*/}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions wwwwwwwwwwwwwwwwwwwwwwwwlong text</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions wwwwwwwwwwwwwwwwwwwwwwwwlong text</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
        <div>Subscriptions</div> {/* Static text for now, can be dynamic */}
      </div>
    </div>
  );
};

export default HighestSpending;
