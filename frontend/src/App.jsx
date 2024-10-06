import './App.css';
import './CSS Files/Navbar.css';
import './CSS Files/AddTransaction.css'
import './CSS Files/Settings.css'
import './CSS Files/Settings Components/ChangeModals.css'
import {HashRouter, Routes, Route, useLocation} from 'react-router-dom'
import Settings from "./Page/Settings";
import Login from './Page/Login';
import Dashboard from './Page/Dashboard';
import Registration from './Page/Registration';
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


function App() {
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [pfp, setPFP] = useState(0);
    const [username, setUsername] = useState("DefaultName")
    const [isLoaded, setIsLoaded] = useState(false)
    const [transactions, setTransactions] = useState([]);
    const [maxTransID, setMaxTransID] = useState(1);
    const userID = sessionStorage.getItem('User')


    useEffect(() => {

        if (userID) {
            if (!isLoaded) {
                let getUsername = sessionStorage.getItem('username');
                let getPFP = sessionStorage.getItem('pfp');

                if (getUsername) setUsername(getUsername);
                if (getPFP) setPFP(parseInt(getPFP) || 0);
                getTransactions();
                setIsLoaded(true);
            }
        }

    }, [isLoaded])

    const getTransactions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/transactions.php?id=${userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let userData = await response.json();
            if (userData) {
                console.log(userData)
                setTransactions(userData)
                if (userData.length > 0) {
                    let transIDs = userData.filter(trans => trans.id)
                    setMaxTransID(Math.max(transIDs))
                }
            } else {
                console.error("Error getting transactions...")
            }
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
        const newTransactions = transactions;
        newTransactions.push(newItem)
        setTransactions(newTransactions);
        saveTransactions(newItem)
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
                body: JSON.stringify({userID, saveItem}),
            });
            if (!response.ok) {
                console.error("Error getting transactions...")
            }
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
                body: JSON.stringify({userID, removeID}),
            });
            if (!response.ok) {
                console.error("Error getting transactions...")
            }
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

    const openTransactionModal = () => {
        setShowAddTransaction(true);
    }

    const closeTransactionModal = () => {
        setShowAddTransaction(false);
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

  return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <Navbar pfp={pfp} pfpMap={pfpMap} openModal={openTransactionModal} openSettings={openSettings}/>
            <Routes>
            <Route path={"/"} element={<Homepage deleteTransaction={removeTransaction} transactions={transactions} openTransactionModal={openTransactionModal}/>}/> =
              <Route path={"/settings"} element={<Settings/>}/>
              <Route path={"/forget-password"} element={<ForgotPassword/>}/>
              <Route path={"/reset-password"} element={<ResetPassword/>}/>
              <Route path="/registration" element={<Registration />} />
            </Routes>
              {showAddTransaction ? <AddTransaction maxTransID={maxTransID} updateMaxTransID={updateMaxTransID} addTransaction={addTransaction} removeTransaction={removeTransaction} closeModal={closeTransactionModal}/>:null}
              {showSettings ? <Settings username={username} changeUsername={changeUsername} pfp={pfp} changePFP={changePFP} pfpMap={pfpMap} closeSettings={closeSettings}/>:null}

          </header>
        </div>
      </HashRouter>
  );
};

export default App;
