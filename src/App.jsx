import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('');

  useEffect(() => {
      fetch('http://localhost:8080/expenses?userId=1') // Replace with your Spring Boot API URL
          .then(response => response.text())
          .then(data => setData(data))
          .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
      <div>
          <h1>Data from Spring Boot:</h1>
          <p>{data}</p>
      </div>
  );
}

export default App
