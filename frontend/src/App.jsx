import './App.css';
import './CSS Files/Navbar.css';
import './CSS Files/AddTransaction.css'
import './CSS Files/Settings.css'
import './CSS Files/Settings Components/ChangeModals.css'
import './CSS Files/EditTransaction.css'
import './CSS Files/SavingsGoalBox.css'
import './CSS Files/Settings Components/ReorderWidgets.css'
import './CSS Files/Dashboard Components/AccountHealthWidget.css'
import './CSS Files/HealthSnapshot.css'
import {HashRouter, Routes, Route, useLocation} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Settings from "./Page/Settings";
import Login from './Page/Login';
import Dashboard from './Page/Dashboard';
import Registration from './Page/Registration';
import Income from './Page/Income';
import Navbar from './Component/Navbar';
import {useEffect, useState} from "react";
import AddTransaction from "./Component/AddTransaction";
import Homepage from "./Page/Homepage.jsx";
import ForgotPassword from "./Page/ForgotPassword.jsx";
import ResetPassword from "./Page/ResetPassword.jsx";
import img0 from "./Assets/Profile Pictures/Person1.svg"
import img1 from "./Assets/Profile Pictures/Person2.svg"
import img2 from "./Assets/Profile Pictures/Person3.svg"
import img3 from "./Assets/Profile Pictures/Person4.svg"
import img4 from "./Assets/Profile Pictures/Person5.svg"
import img5 from "./Assets/Profile Pictures/Person6.svg"
import img6 from "./Assets/Profile Pictures/Person7.svg"
import img7 from "./Assets/Profile Pictures/Person8.svg"
import AddGoal from "./Component/AddGoals.jsx";
import EditTransaction from "./Component/EditTransaction.jsx";
import EditGoal from "./Component/EditGoal.jsx";
import MessagePopup from "./Component/MessagePopup.jsx";
//import { fetchGoals, addGoal, updateGoal, deleteGoal } from './api/GoalAPI';


function App() {
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showEditTransaction, setShowEditTransaction] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [pfp, setPFP] = useState(0);
    const [username, setUsername] = useState("DefaultName")
    const [isLoaded, setIsLoaded] = useState(false)
    const [transactions, setTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [editTransaction, setEditTransaction] = useState({});
    const [editGoal, setEditGoal] = useState({});
    const [maxTransID, setMaxTransID] = useState(1);
    // Add Goals section
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false)
    const [goals, setGoals] = useState([]);
    const [maxGoalID, setMaxGoalID] = useState(1);
    // Add Goals section
    const userID = sessionStorage.getItem('User');
    const userToken = sessionStorage.getItem('auth_token');
    // Add Piggybank Section
    const [goal_allocation_amount, setgoal_allocation_amount] = useState(0);
    const [monthly_savings_goal, setmonthly_saving_goal] = useState(0);
    const [showMessagePopup, setShowMessagePopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState('')
    // Widget Order
    const defaultOrder = [
        'Categorized Spending',
        'Monthly Spending',
        'Transactions',
        'Income Report',
        'Goals',
        'Monthly Health'
      ];
    const [widgetOrder, setWidgetOrder] = useState(defaultOrder)
    const [widgetsLoaded, setWidgetsLoaded] = useState(false)
    // Account Health
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const spent = filteredTransactions.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const [monthlyIncome, setMonthlyIncome] = useState(0)
    const savingsGoal = ((parseFloat(goal_allocation_amount)/parseFloat(monthly_savings_goal)) * 100) || 0;

    useEffect(() => {

        if (userID && userToken) {
            if (!isLoaded) {
                let getUsername = sessionStorage.getItem('username');
                let getPFP = sessionStorage.getItem('pfp');

                if (getUsername) setUsername(getUsername);
                if (getPFP) setPFP(parseInt(getPFP) || 0);
                getTransactions();
                getGoals();
                fetchIncome();
                fetchSavingsGoal();
                fetchMonthlyIncome()
                if (!widgetsLoaded) {
                    getWidgetOrder().then(r => setWidgetsLoaded(true));
                }
                setIsLoaded(true);
            }
        }

    }, [isLoaded])

    const fetchIncome = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&token=${userToken}`); // Update to the correct endpoint
            const data = await response.json();

            if (data.success) {
                setIncome(parseFloat(data.totalIncome)); // Set the total income from the database
            } else {
                console.error("Error fetching income:", data.message);
            }
        } catch (error) {
            console.error("Error fetching income:", error);
        }
    };

    const fetchMonthlyIncome = async () => {
        const currentMonthIncomeResponse = await fetch(`${import.meta.env.VITE_API_PATH}/routes/update_income.php?user_id=${userID}&current_month=true&token=${userToken}`);
        const currentMonthIncomeData = await currentMonthIncomeResponse.json();

        if (currentMonthIncomeData.success) {
            setMonthlyIncome(parseFloat(currentMonthIncomeData.totalIncome) || 0);
        } else {
            console.error("Error fetching current month's income:", currentMonthIncomeData.message);
        }
    }

    const filterTransactions = (transactionsParam) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0 is January, 11 is December
        const currentYear = currentDate.getFullYear();

        // Filter transactions based on the current month and year
        const filtered = transactionsParam.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();

            return transactionMonth === currentMonth && transactionYear === currentYear;
        });

        // Sort the filtered transactions by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted;
    };

    const getTransactions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php?id=${userID}&token=${userToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let reply = await response.json();

            if (!response.ok) {
                console.error("Error getting transactions...")
            }

            if (reply.success) {
                setTransactions(reply.transactions)
                let filtered = filterTransactions(reply.transactions)
                setFilteredTransactions(filtered)
                if (reply.transactions.length > 0) {
                    let transIDs = reply.transactions.filter(trans => trans.id)
                    setMaxTransID(Math.max(transIDs))
                }
            } else {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }


        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getGoals = async () => {
        try {
            // Assume we have an API that fetches goals
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php?id=${userID}&token=${userToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let reply = await response.json();

            if (!response.ok) {
                console.error("Error getting goals...");
            }

            if (reply.success) {
                setGoals(reply.goals);
                if (reply.goals.length > 0) {
                    let goalIDs = reply.goals.map(goal => goal.id);
                    setMaxGoalID(Math.max(...goalIDs));
                }
            } else {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getWidgetOrder = async () => {
        try {
            // Assume we have an API that fetches goals
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/widgets.php?id=${userID}&token=${userToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let reply = await response.json();
            if (reply.success) {
                if (reply.widget_order !== "Default") {
                    setWidgetOrder(reply.widget_order);
                }
            } else {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSaveWidgetOrder = (newOrder) => {
        setWidgetOrder(newOrder)
        saveWidgetOrder(newOrder)
    }

    const saveWidgetOrder = async (newOrder) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/widgets.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userID, userToken, newOrder}),
            });
            const reply = await response.json()
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }
            setIsLoaded(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const pfpMap = {
        0: img0,
        1: img1,
        2: img2,
        3: img3,
        4: img4,
        5: img5,
        6: img6,
        7: img7
    }

    const addTransaction = (newItem) => {
        const newTransactions = [...transactions];
        newTransactions.push(newItem)
        setTransactions(newTransactions);
        saveTransactions(newItem)
    }
    const addGoal = (newGoal) => {
        const newGoals = [...goals];
        newGoals.push(newGoal);
        setGoals(newGoals);
        saveGoal(newGoal);
    };

    const saveEditTransaction = (updated) => {
        const editedTransactions = [...transactions];
        const editedIndex = editedTransactions.findIndex(trans => trans.id === updated.id)
        editedTransactions[editedIndex].name = updated.name;
        editedTransactions[editedIndex].price = updated.price;
        editedTransactions[editedIndex].category = updated.category;
        editedTransactions[editedIndex].date = updated.date;
        editedTransactions[editedIndex].recurring = updated.recurring;
        setTransactions(editedTransactions);
        updateDatabaseTransactions(updated);
    }
    const saveEditGoal = (updatedGoal) => {
        // Create a copy of the existing goals
        const editedGoals = [...goals];

        // Find the index of the goal that needs to be updated
        const editedIndex = editedGoals.findIndex(goal => goal.id === updatedGoal.id);

        // Update the goal properties
        if (editedIndex !== -1) {
            editedGoals[editedIndex].name = updatedGoal.name;
            editedGoals[editedIndex].cost = updatedGoal.cost;
            editedGoals[editedIndex].date = updatedGoal.date;
            editedGoals[editedIndex].category = updatedGoal.category;
            editedGoals[editedIndex].allocated = updatedGoal.allocated;

            // Update the state with the modified goals list
            setGoals(editedGoals);

            // Optionally update the backend/database
            saveEditGoalDatabase(updatedGoal);
        }
    };


// Piggybank Section fetching 
    const fetchSavingsGoal = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/piggybank_goals.php?user_id=${userID}`);
            const data = await response.json();

            if (data.success) {
                setgoal_allocation_amount(parseFloat(data.current_goal_allocation));
                setmonthly_saving_goal(parseFloat(data.monthly_saving_goal));
            } else {
                console.error("Error fetching savings goal / Current Savings:", data.message);
            }
        } catch (error) {
            console.error("Error fetching savings goal:", error);
        }
    };


    const updateGoalAllocation = async (amount) => {
        const newAllocation = goal_allocation_amount + amount;


        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/piggybank_goals.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: userID,
                    allocation: amount,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Fetch the updated goals after successfully updating
                fetchSavingsGoal();
            } else {
                console.error("Error updating savings goal:", data.message);
            }
        } catch (error) {
            console.error("Error updating savings goal:", error);
        }
    };

    const updateMonthlySavingsGoal = async (newGoal) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/piggybank_goals.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: userID,
                    monthlySavingGoal: newGoal,
                }),
            });

            const textResponse = await response.text(); // Get the raw response as text
            console.log("Raw response:", textResponse); // Log the raw response

            const data = JSON.parse(textResponse); // Try to parse the text response as JSON
            if (data.success) {
                // Fetch the updated goals after successfully updating
                fetchSavingsGoal();
            } else {
                console.error("Error updating monthly savings goal:", data.message);
            }
        } catch (error) {
            console.error("Error updating monthly savings goal:", error);
        }
    };
// END OF PIGGY BANK

    const updateEditTransaction = (transaction) => {
        setEditTransaction(transaction);
    }

    const updateMaxTransID = (e) => {
        setMaxTransID(e)
    }

        const saveTransactions = async (saveItem) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userID, userToken, saveItem}),
                });
                if (!response.ok) {
                    console.error("Error saving transactions...")
                }
            const reply = await response.json()
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }
            setIsLoaded(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const saveGoal = async (newGoal) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: userID,
                    userToken: userToken,
                    goal: newGoal,
                }),
            });
            if (!response.ok) {
                console.error("Error saving goals...");
            }
            const reply = await response.json();
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
            getGoals()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const saveEditGoalDatabase = async (updateItem) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userID, userToken, updateItem}),
            });
            if (!response.ok) {
                console.error("Error updating transactions...")
            }
            const reply = await response.json()
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }
            setIsLoaded(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }
// END OF PIGGYBANK
    const updateDatabaseTransactions = async (updateItem) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php`, {
                method: 'UPDATE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userID, userToken, updateItem}),
            });
            if (!response.ok) {
                console.error("Error updating transactions...")
            }
            const reply = await response.json()
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }
            setIsLoaded(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const saveRemoveTransaction = async (removeID) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userID, userToken, removeID}),
            });
            if (!response.ok) {
                console.error("Error deleting transactions...")
            }
            const reply = await response.json()
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...")
                openPopup()
                sessionStorage.clear()
                window.location.reload()
            }
            setIsLoaded(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const saveRemoveGoal = async (goalID) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, userToken, goalID }),
            });
            if (!response.ok) {
                console.error("Error deleting goals...");
            }
            const reply = await response.json();
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const saveGoalAllocation = async (goalID, allocation) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'UPDATE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, userToken, goalID, allocation }),
            });
            if (!response.ok) {
                console.error("Error updating allocation for goal...");
            }
            const reply = await response.json();
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
            getGoals()
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const setGoalCompletion = async (goalID, completion, date) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/goal.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, userToken, goalID, completion, date }),
            });
            if (!response.ok) {
                console.error("Error updating allocation for goal...");
            }
            const reply = await response.json();
            if (!reply.success) {
                setAlertMessage("Invalid user credentials, please sign in again...");
                openPopup()
                sessionStorage.clear();
                window.location.reload();
            }
            getGoals()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const removeTransaction = (id) => {
        const newTransactions = [...transactions]
        const removeIdx = newTransactions.findIndex(transaction => transaction.id === id);
        newTransactions.splice(removeIdx, 1);
        setTransactions(newTransactions)
        saveRemoveTransaction(id);
    }

    const removeGoal = (id) => {
        const updatedGoals = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoals);
        saveRemoveGoal(id);
    };

    const openTransactionModal = () => {
        setShowAddTransaction(true);
    }

    const closeTransactionModal = () => {
        setShowAddTransaction(false);
    }
    const openGoalModal = () => {
        setShowAddGoal(true);
    };

    const closeGoalModal = () => {
        setShowAddGoal(false);
    };

    const openEditGoal = () => {
        setShowEditGoal(true)
    }

    const closeEditGoal = () => {
        setShowEditGoal(false)
    }

    const updateEditGoal = (oldGoal) => {
        setEditGoal(oldGoal)
    }

    const openEditModal = () => {
        setShowEditTransaction(true);
    }

    const closeEditModal = () => {
        setShowEditTransaction(false);
    }

    const openSettings = () => {
        setShowSettings(true);
    }

    const closeSettings = () => {
        setShowSettings(false);
    }

    const changePFP = (e) => {
        setPFP(e);
        sessionStorage.setItem('pfp', e)
    }

    const changeUsername = (e) => {
        setUsername(e);
        sessionStorage.setItem('username', e)
    }
// GOALS MODAL SECTION

    const updateMaxGoalID = (newID) => {
        setMaxGoalID(newID);
    };

    const openPopup = () => {
        setShowMessagePopup(true)
    }

    const closePopup = () => {
        setShowMessagePopup(false)
    }

    const setAlertMessage = (e) => {
        setPopupMessage(e)
    }



  return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
          <Navbar username={username} pfp={pfp} pfpMap={pfpMap} openModal={openTransactionModal}
        openSettings={openSettings} allocated_saving_amount={goal_allocation_amount}
        monthly_saving_goal={monthly_savings_goal} onUpdateMonthlyGoal={updateMonthlySavingsGoal}
        onUpdateAllocation={updateGoalAllocation} openError={openPopup} setErrorMessage={setAlertMessage}/>
            <Routes>
            <Route path={"/"} element={<Homepage
                monthlyIncome={monthlyIncome}
                spent={spent}
                savingsGoal={savingsGoal}
                widgetOrder={widgetOrder}
                openError={openPopup}
                setErrorMessage={setAlertMessage}
                saveGoalAllocation={saveGoalAllocation}
                setGoalCompletion={setGoalCompletion}
                openEditModal={openEditModal}
                openEditGoal={openEditGoal}
                updateEditGoal={updateEditGoal}
                updateEditTransaction={updateEditTransaction}
                deleteTransaction={removeTransaction}
                transactions={transactions}
                openTransactionModal={openTransactionModal}
                income={income}
                addGoal={addGoal}
                deleteGoal={removeGoal}
                goals={goals}
                openGoalModal={openGoalModal}
            />}/>
              <Route path={"/forget-password"} element={<ForgotPassword openError={openPopup} setErrorMessage={setAlertMessage}/>}/>
              <Route path={"/reset-password"} element={<ResetPassword openError={openPopup} setErrorMessage={setAlertMessage}/>}/>
              <Route path="/registration" element={<Registration openError={openPopup} setErrorMessage={setAlertMessage} />} />
              <Route path="/income" element={<Income openError={openPopup} setErrorMessage={setAlertMessage}/>} />
            </Routes>
              {showEditTransaction && <EditTransaction saveEditTransaction={saveEditTransaction} oldTransaction={editTransaction} closeModal={closeEditModal}/>}
              {showAddTransaction && <AddTransaction transactions={transactions} maxTransID={maxTransID} updateMaxTransID={updateMaxTransID} addTransaction={addTransaction} removeTransaction={removeTransaction} closeModal={closeTransactionModal}/>}
              {showEditGoal && <EditGoal saveEditGoal={saveEditGoal} oldGoal={editGoal} closeModal={closeEditGoal}/>}
              {showAddGoal && <AddGoal maxGoalID={maxGoalID} updateMaxGoalID={updateMaxGoalID} addGoal={addGoal} closeModal={closeGoalModal} deleteGoal ={removeGoal} />}
              {showSettings &&  <Settings setWidgetOrder={handleSaveWidgetOrder} widgetOrder={widgetOrder} openError={openPopup} setErrorMessage={setAlertMessage} username={username} changeUsername={changeUsername} pfp={pfp} changePFP={changePFP} pfpMap={pfpMap} closeSettings={closeSettings}/>}
              {showMessagePopup && <MessagePopup closeModal={closePopup} message={popupMessage} />}
          </header>
        </div>
      </HashRouter>
  );
    }

export default App;