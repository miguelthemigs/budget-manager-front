import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './App.css';
import NavBar from './components/NavBar';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ExpensePage from './pages/ExpensePage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const [data, setData] = useState([]);

   
    return (
        <div className='App'>
          <Router>
          <NavBar />
          <Routes>
          <Route path="/" element={<ExpensePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          </Router>
            
                
         
            
        </div>
    );
}

export default App;


