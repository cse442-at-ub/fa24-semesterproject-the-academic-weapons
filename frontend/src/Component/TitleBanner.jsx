import React from 'react';
import '../CSS Files/TitleBanner.css';
import {useNavigate} from "react-router-dom"; // Import the CSS specific to this component

const TitleBanner = () => {
    const navigate = useNavigate();

  return (
    <div onClick={event => navigate('/')} className="Register_Title">
      <h1>Wealth Wise</h1>
    </div>
  );
};

export default TitleBanner;
