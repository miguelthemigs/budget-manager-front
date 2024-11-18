import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../services/AuthAPI';

function LoginForm(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  

  const handleSubmit = (event) => {
    event.preventDefault();

    // Attempt login
    AuthAPI.login(email, password)
      .then((accessToken) => {
        console.log('Logged in successfully, token:', accessToken);
        // Redirect to a specific page after login
        navigate('/'); // Replace '/dashboard' with your desired route
      })
      .catch((error) => {
        setError('Invalid credentials. Please try again.');
        console.error('Login error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
