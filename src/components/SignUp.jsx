import React, { useState } from "react"

export default function Welcome() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")



  function handleSignUp() {
    if( username&&password ){
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    })
   
    .then(response => {
      if (response.status === 201) {
        console.log('success')
        setMessage("Success! Please Login Now!")
      }
      return response.text()
    })

    .then(()=>{
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);

    })
    .then(responseText => {
      console.log(responseText)
    })
    .catch(error => {
      console.error(error)
    })
  }else{
      window.alert('You must provide a valid Name and Password')
        
  }
  }
    
    


 
  
  

  return (
    
    <div className="signup">
      <div className="login-form">
      <div id="msg">{message}</div>
      <h1>Notes</h1>
      <p>Welcome to Notes, create and save your notes!</p>
      <h2>Create Your Account</h2>
      <label htmlFor="user">Enter your name</label>
      <br />
      <input
        id="user"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <div className="password">
        <label htmlFor="password">Enter Password</label>
        <br />
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
      </div>
      <button type="button" className="green" onClick={handleSignUp}>
        Sign Up
      </button> 
      <p>Already have an account? Please Sign In.</p>
      <button className="green" onClick={()=>window.location.href = '/login'}>Sign In</button>
      <div className="hero"></div>
    </div>
    </div>
  );
}