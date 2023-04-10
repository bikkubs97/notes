const initialState = {
    notes: []
  }

export default function notesReducer(state = initialState, action) {
  
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload]
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => note.id === action.payload.id ? action.payload : note)
      };
      case 'DELETE_NOTE':
        return {
          ...state,
          notes: state.notes.filter(note => note._id !== action.payload)
        };
      
      
  case 'SET_NOTE':
  return {
    ...state,
    notes: action.payload
  };

    default:
      return state
  }
}
