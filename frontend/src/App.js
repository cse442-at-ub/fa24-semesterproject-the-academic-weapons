import logo from './logo.svg';
import './App.css';
import {HashRouter, Routes, Route} from 'react-router-dom'
import Settings from "./Page/Settings";
import Dashboard from './Page/Dashboard';
import Navbar from './Component/Navbar';
import PieChart from './Component/MainPieChart'


function App() {
  return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <Navbar/>
            <Routes>
              <Route path={"/dashboard"} element={<Dashboard/>}/>
              <Route path={"/settings"} element={<Settings/>}/>
            </Routes>
          </header>
        </div>
      </HashRouter>
  );
};

export default App;
