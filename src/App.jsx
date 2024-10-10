import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './App.css';
import NavBar from './components/NavBar';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import DemoPage from './pages/DemoPage';
import ExpensePage from './pages/ExpensePage';

function App() {
    const [data, setData] = useState([]);

   
    return (
        <div className='App'>
          <Router>
          <NavBar />
          <Routes>
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/" element={<ExpensePage />} />
          </Routes>
          </Router>
            
                
         
            
        </div>
    );
}

export default App;


