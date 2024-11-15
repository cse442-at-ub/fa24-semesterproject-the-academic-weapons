import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";


const Homepage = ( {widgetOrder, openError, setErrorMessage, updateEditGoal, openEditGoal, setGoalCompletion, saveGoalAllocation, income, updateEditTransaction, openEditModal, openTransactionModal, transactions, deleteTransaction, addGoal, deleteGoal, goals,openGoalModal} ) => {
    const userID = sessionStorage.getItem("User")
    const userToken = sessionStorage.getItem("auth_token")


    return (
        <div>
      {!userID || !userToken ? (
        <>
          <Login openError={openError} setErrorMessage={setErrorMessage}/>
        </>
      ) : (
        <Dashboard
            widgetOrder={widgetOrder}
            updateEditGoal={updateEditGoal}
            openEditGoal={openEditGoal}
            setGoalCompletion={setGoalCompletion}
            saveGoalAllocation={saveGoalAllocation}
            updateEditTransaction={updateEditTransaction}
            deleteTransaction={deleteTransaction}
            openEditModal={openEditModal}
            transactions={transactions}
            openTransactionModal={openTransactionModal}
            income={income}
            addGoal={addGoal}
            deleteGoal={deleteGoal}
            goals={goals}
            openGoalModal={openGoalModal}

        />
      )}
    </div>
    );
}

export default Homepage;