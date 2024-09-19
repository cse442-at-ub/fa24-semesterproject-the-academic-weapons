import logo from './logo.svg';
import './App.css';
import {HashRouter, Routes, Route} from 'react-router-dom'
import Settings from "./Page/Settings";

function App() {
  return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path={"/settings"} element={<Settings/>}/>
            </Routes>
          </header>
        </div>
      </HashRouter>
  );
};

export default App;
