import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";


const Homepage = ( {updateEditTransaction, openEditModal, openTransactionModal, transactions, deleteTransaction} ) => {
    const userID = sessionStorage.getItem("User")
    const userToken = sessionStorage.getItem("auth_token")


    return (
        <div>
      {!userID || !userToken ? (
        <>
          <Login/>
        </>
      ) : (
        <Dashboard updateEditTransaction={updateEditTransaction} deleteTransaction={deleteTransaction} openEditModal={openEditModal} transactions={transactions} openModal={openTransactionModal}/>
      )}
    </div>
    );
}

export default Homepage;