import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNote, deleteNote, updateNote } from '../action';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Account() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);
  const [editNoteData, setEditNoteData] = useState(null);

  const { username } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(
        `https://notes-server-2anm.onrender.com/notes?username=${username}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch(setNote(data));
        })
        .catch((error) => console.error(error));
    }
  }, [username]);

  function handleCancelEdit() {
    setEditNoteData(null);
  }

  function redirect() {
    window.location.href = `/new/${username}`;
  }

  function handleDelete(id) {
    const token = localStorage.getItem('token');
    fetch(`https://notes-server-2anm.onrender.com/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        dispatch(deleteNote(id));
      })
      .catch((error) => console.error(error));
  }

  function handleSignOut() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditNoteData({
      ...editNoteData,
      [name]: value,
    });
  }

  function handleSaveChange(id) {
    const token = localStorage.getItem('token');
    const updatedNote = {
      title: editNoteData.title,
      content: editNoteData.content,
      dateCreated: editNoteData.dateCreated,
      lastModified: new Date().toLocaleString(),
    };

    fetch(`https://notes-server-2anm.onrender.com/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => response.text())

      .then((data) => {
        console.log(data);
        dispatch(updateNote(data));
        setEditNoteData(null);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <div className="head">
        <button className="green" onClick={redirect}>
          Add New Note
        </button>
        <h1>Your Notes</h1>
        <button className="delete" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {notes.map((note) => (
        <div className="note" key={note._id}>
          <h2>{note.title}</h2>
          <h3 className="title">{note.content}</h3>
          <p>Created: {note.dateCreated.split('T')[0]}</p>
          <p>Last Modified: {note.lastModified.split('T')[0]}</p>
          <button className="edit" onClick={() => setEditNoteData(note)}>
            Edit Note
          </button>
          <button className="delete" onClick={() => handleDelete(note._id)}>
            Delete Note
          </button>
        </div>
      ))}

      {editNoteData && (
        <div className="edit-note">
          {console.log(editNoteData)}
          <h2>Edit Note</h2>
          <form>
            <label>
              Title:
              <br />
              <input
                type="text"
                name="title"
                value={editNoteData.title}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Content: <br />
              <textarea
                name="content"
                value={editNoteData.content}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button
              className="green"
              onClick={() => handleSaveChange(editNoteData._id)}
            >
              Save Changes
            </button>
            <button className="delete" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
