import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../services/AuthAPI'; // Import AuthAPI

function RegistrationForm(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const navigate = useNavigate(); 

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (emailError) {
      alert('Please fix the email error before submitting.');
      return;
    }

    if (password !== repeatedPassword) {
      setRegistrationError('Passwords do not match');
      return;
    }

    const registrationData = {
      name: username,
      email,
      password,
      repeatedPassword,
    };

    try {
      // Call the AuthAPI.register method to register the user
      const registrationResponse = await AuthAPI.register(registrationData);
      console.log('Registration successful:', registrationResponse);

      // After successful registration, log the user in
      const loginResponse = await AuthAPI.login(email, password);
      navigate("/"); 

      console.log('Registration and login successful:', loginResponse);
      

    } catch (error) {
      console.error('Registration or login failed', error);
      console.log(registrationData);
      console.log();
      setRegistrationError('Registration or login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="password"
        value={repeatedPassword}
        onChange={(e) => setRepeatedPassword(e.target.value)}
        placeholder="Repeat your password"
      />
      {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
