import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNote } from "../action";
import { useParams } from "react-router-dom";

export default function New() {
  const dispatch = useDispatch()
  const { username } = useParams()



  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleAddNote() {
    const newNote = { title, content };
    dispatch(addNote(newNote));

    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New note created:", data);
      })
      .then(() => {
        window.location.href = `/account/${username}`;
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <div className="new">
        <h1>Add a New Note</h1>
        <label>
          Title:
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Content:
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <br />
        <button className="green" onClick={handleAddNote}>Add Note</button>
      </div>
    </div>
  );
}
