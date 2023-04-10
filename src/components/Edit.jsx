import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function Edit() {
  const { id } = useParams();
  const note = useSelector(state => state.notes.find(note => note._id === id));
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
 

  function handleEditNote() {
    const updatedNote = { id, title, content };
    // dispatch an action to update the note in the store and send a request to update the note on the server
  }

  return (
    <div>
      <div className="new">
        <h1>Edit Note</h1>
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
        <button onClick={handleEditNote}>Save Changes</button>
      </div>
    </div>
  );
}
