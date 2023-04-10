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
  console.log(notes);
  const [editNoteData, setEditNoteData] = useState(null);

  const { username } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`https://notes-server-xm4d.onrender.com/notes?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setNote(data));
        })
        .catch((error) => console.error(error));
    }
  }, [username]);

  function handleEditButton(note) {
    setNoteToEdit(note);
  }

  function handleCancelEdit() {
    setNoteToEdit(null);
  }

  function redirect() {
    window.location.href = `/new/${username}`
  }
  

  function handleDelete(id) {
    const token = localStorage.getItem('token');
    fetch(`https://notes-server-xm4d.onrender.com/notes/${id}`, {
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
  function handleInputChange(event){
    const { name, value } = event.target;
    setEditNoteData({
      ...editNoteData,
      [name]: value,
    })
  }

  function handleSaveChange(noteId) {
    const token = localStorage.getItem('token');
    const updatedNote = {
      title: editNoteData.title,
      content: editNoteData.content,
      dateCreated: editNoteData.dateCreated,
      lastModified: new Date().toLocaleString(),
    }
  
    fetch(`https://notes-server-xm4d.onrender.com/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(updateNote(data));
        setShowEditForm(false);
      })
      .catch((error) => console.error(error));
  }
  
    return (
      <div>
        <h1>Your Notes</h1>
        <button className="green" onClick={redirect}>
          Add New Note
        </button>
        <button className="delete signout" onClick={handleSignOut}>
          Sign Out
        </button>
        {notes &&
          notes.map((note) => (
            <div className="note" key={note._id}>
              <h2>{note.title}</h2>
              <h3 className="title">{note.content}</h3>
              <p>Created: {note.dateCreated}</p>
              <p>Last Modified: {note.lastModified}</p>
              <button
                className="edit"
                onClick={() => setEditNoteData(note)}
              >
                Edit Note
              </button>
              <button className="delete" onClick={() => handleDelete(note._id)}>
                Delete Note
              </button>
            </div>
          ))}
        {editNoteData && (
          <div className='edit-note'>
            <h2>Edit Note</h2>
            <form onSubmit={handleEditButton}>
              <label>
                Title:<br/>
                <input
                  type="text"
                  name="title"
                  value={editNoteData.title}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Content: <br/>
                <textarea
                  name="content"
                  value={editNoteData.content}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <button className='green' onClick={() => handleSaveChange(editNoteData._id)}>Save Changes</button>
              <button className='delete' onClick={handleCancelEdit}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    );
    
}
