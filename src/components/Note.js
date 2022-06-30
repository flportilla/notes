import React from 'react'

export default function Note({ note, toggleImportance }) {

  return (
    <li key={note.id}>
      {note.content}
      <button
        key={(note.id + 1)}
        type='button'
        onClick={toggleImportance}
      >
        Toggle
      </button>
    </li>
  )
}
