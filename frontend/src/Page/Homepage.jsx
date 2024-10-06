import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";


const Homepage = ( {openTransactionModal, transactions, deleteTransaction} ) => {
    const userID = sessionStorage.getItem("User")


    return (
        <div>
      {!userID ? (
        <>
          <Login/>
        </>
      ) : (
        <Dashboard deleteTransaction={deleteTransaction} transactions={transactions} openModal={openTransactionModal}/>
      )}
    </div>
    );
}

export default Homepage;