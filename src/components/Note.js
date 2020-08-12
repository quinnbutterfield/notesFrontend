import React from 'react'
import propTypes from 'prop-types'

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make unimportant' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

Note.propTypes = {
  toggleImportance: propTypes.func.isRequired
}

export default Note