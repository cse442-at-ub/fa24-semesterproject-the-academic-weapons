import logo from './logo.svg';
import './App.css';
import './CSS Files/Navbar.css';
import './CSS Files/AddTransaction.css'
import './CSS Files/Settings.css'
import './CSS Files/Settings Components/ChangeUsername.css'
import {HashRouter, Routes, Route} from 'react-router-dom'
import Settings from "./Page/Settings";
import Dashboard from './Page/Dashboard';
import Navbar from './Component/Navbar';
import {useState} from "react";
import AddTransaction from "./Component/AddTransaction";


function App() {
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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

  return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <Navbar openModal={openTransactionModal} openSettings={openSettings}/>
            <Routes>
              <Route path={"/"} element={<Dashboard openModal={openTransactionModal}/>}/>
              <Route path={"/settings"} element={<Settings/>}/>
            </Routes>

              {showAddTransaction ? <AddTransaction closeModal={closeTransactionModal}/>:null}
              {showSettings ? <Settings closeSettings={closeSettings}/>:null}

          </header>
        </div>
      </HashRouter>
  );
};

export default App;
