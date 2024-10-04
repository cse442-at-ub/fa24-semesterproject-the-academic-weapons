import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";


const Homepage = ( {openTransactionModal} ) => {
    const userID = sessionStorage.getItem("User")


    return (
        <div>
      {!userID ? (
        <>
         <Dashboard openModal={openTransactionModal}/>
          {/* <Login/> */}
        </>
      ) : (
        <Dashboard openModal={openTransactionModal}/>
      )}
    </div>
    );
}

export default Homepage;