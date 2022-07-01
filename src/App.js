import Note from './components/Note'
import { useEffect, useState } from 'react'
import noteService from '../src/services/notes'

function App() {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  const getNotes = () => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  };

  useEffect(getNotes, [])

  function toggleImportance(id) {

    const note = notes.find(note => note.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `the note ${note.content} was already deleted from the server`
        )
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  function addNote(event) {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote =>
        setNotes(notes.concat(returnedNote))
      )
    setNewNote('')
  }

  function handleNoteChange(event) {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button type="button" onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => {
          return <Note toggleImportance={() => toggleImportance(note.id)} note={note} />
        }
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App