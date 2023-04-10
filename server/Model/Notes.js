
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export const Note = mongoose.model('Note', NoteSchema);
