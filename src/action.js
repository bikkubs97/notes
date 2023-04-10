export function addNote(notes) {
    return {
      type: 'ADD_NOTE',
      payload: notes
    }
  }
  
  export function updateNote(notes) {
    return {
      type: 'UPDATE_NOTE',
      payload: notes
    }
  }
  export function deleteNote(noteId) {
    return {
      type: 'DELETE_NOTE',
      payload: noteId
    }
  }
  

  export function setNote(notes) {
    return {
      type: 'SET_NOTE',
      payload: notes
    }
  }

  


   