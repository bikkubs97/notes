import React from "react"
import {useState} from "react"




export default function Login() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setloginMessage] = useState('')
  


  function handleSignIn(event) {
    event.preventDefault()   
    fetch("https://notes-server-xm4d.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 202) {
          console.log("success")
          setloginMessage("Login Suceessful!")
          return response.json()

        } else {

          setloginMessage("Incorrect username or password")    
          throw new Error("Authentication failed")
       

        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token)
        setTimeout(() => {
          window.location.href = `/account/${username}`
        }, 1000);
        dispatch(setNote(data.notes))
      })
      .catch((error) => {
        console.error(error)
      })
  }
  

  return (
    <div className="login">
         <h1>Notes</h1>
      <p>Welcome to Notes, Write and save your notes!</p>
    <h2 className="sign">Sign In</h2>
    <form className="login-form" onSubmit={handleSignIn}>
    <label htmlFor="name">Name</label>
    <div>
    <input id="name" 
         required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      </div>
      <div>
    <label htmlFor="password" >Password</label><br/>
    <input type="password" id="password"
     required
     value={password}
     onChange={(e) => setPassword(e.target.value)}
    />
    </div>
    <button className="green" type="submit" >Sign in</button>
    </form>
    <div className="msg">{loginMessage}</div>
    <div className="hero">
      </div>
    
  </div>)

}
