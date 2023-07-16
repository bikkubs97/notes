import React, { useState } from 'react';

export default function Welcome() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSignUp() {
    if (username.length < 5 || password.length < 8) {
      setMessage('Username must be at least 5 characters long, and password must be at least 8 characters long.');
      return;
    }

    setMessage('Please Wait...!');
    fetch('https://notes-server-2anm.onrender.com/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('success');
          setMessage('Success! Please Login Now!');
        }
        return response.text();
      })
      .then(() => {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      })
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="signup">
      <div className="login-form">
        {message && <div id="msg">{message}</div>}
        <h1>Notes</h1>
        <p>Welcome to Notes, create and save your notes!</p>
        <h2>Create Your Account</h2>
        <label htmlFor="user">Enter your name</label>
        <br />
        <input
          id="user"
          required
          minLength={5}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setMessage(''); // Reset message when user starts typing
          }}
        />
        <br />
        <div className="password">
          <label htmlFor="password">Enter Password</label>
          <br />
          <input
            id="password"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage(''); // Reset message when user starts typing
            }}
          />
          <br />
        </div>
        <button type="button" className="green" onClick={handleSignUp}>
          Sign Up
        </button>
        <p>Already have an account? Please Sign In.</p>
        <button
          className="green"
          onClick={() => (window.location.href = '/login')}
        >
          Sign In
        </button>
        <div className="hero"></div>
      </div>
    </div>
  );
}
