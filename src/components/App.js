
import React, { useState, useEffect, useRef } from 'react'
import Note from './Note'
import LoginForm from './LoginForm'
import Notification from './Notification'
import NoteForm from './NoteForm'
import Toggleable from './Toggleable'
import Footer from './Footer'
import noteService from './services/notes'





const App = () => {
  const [notes, setNotes] = useState([])

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  const toggleImportanceOf = (id) => {

    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        showError(
          `the note ${note.content} was already deleted from the server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }



  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {

        setNotes(notes.concat(returnedNote))
      })
  }

  const showError = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  useEffect(() => {
    noteService
      .getAll()
      .then(initalNotes => {
        setNotes(initalNotes)
      })
  }, [])

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null
        ?
        <Toggleable buttonLabel='log in'>
          <LoginForm {...{  showError, setUser }} />
        </Toggleable>
        :
        <div>
          <p>{user.name} logged-in
            <button style={{ marginLeft: '5px' }} onClick={() => handleLogout()}>
              logout
            </button>
          </p>
          <Toggleable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm {...{ setNotes, notes, createNote: addNote }} />
          </Toggleable>
          <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all'}
          </button>
          <ul>

            {notesToShow.map((note, i) =>

              <Note
                key={i}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            )}
          </ul>
        </div>
      }
      <div>
      </div>
      <Footer />
    </div>
  )
}

export default App