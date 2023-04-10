import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import { User } from './Model/User.js'
import jwt from 'jsonwebtoken'
import { Note } from './Model/Notes.js'

const app = express()
app.use(cors({ origin: '*' }))
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  config()
}

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
  console.log('connected to mongoose!!')
});

//sign up user
app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      username: req.body.name,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
  }
});

//login route

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.status(400).send('can not find user')
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ user: user }, process.env.JWT_SECRET)

      res.status(202).json({ token })
    } else {
      res.send('Failure')
    }
  } catch {
    res.status(500).send()
  }
})

//get all notes

app.get('/notes', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username })
    if (!user) {
      return res.status(404).send('User not found')
    }
    const notes = await Note.find({ user: user._id })
    res.send(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error getting notes')
  }
})

//post new note

app.post('/notes', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username })

    if (!user) {
      return res.status(404).send('User not found')
    }

    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user: user, // reference to the user object
    });

    const savedNote = await newNote.save()

    res.send(savedNote)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error adding note')
  }
});

//edit a note
app.put('/notes/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).send('Note not found')
    }

    note.title = req.body.title || note.title
    note.content = req.body.content || note.content

    const updatedNote = await note.save()

    res.send(updatedNote)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating note')
  }
});

//delete a note
app.delete('/notes/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).send('Note not found')
    }
    await Note.deleteOne({ _id: req.params.id })
    res.send('Note deleted successfully')
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting note')
  }
});

//middleware function to handle jwt auth
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403)
    req.username = payload.user.username
    next();
  });
}

app.listen(PORT, () => {
  console.log('listening to port 3000')
})
