import React, { useState, useEffect } from 'react'
import phoneService from './services/communication'

const PhonebookApp = () => {


  const [persons, setPersons] = useState([
    //{ name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterBy, setFilterBy] = useState('')
  const [headerMessage, setHeaderMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const hook = () => {

    phoneService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const deleteEntry = id => {
    phoneService
      .deleteEntry(id)
      .then(() => {

        phoneService
          .getAll()
          .then(newPersons => {
            setPersons(newPersons)
          })


      })


  }

  const updateNumber = (name, newNumber) => {

    const person = persons.find(p => p.name === name)
    const changedPerson = { ...person, number: newNumber }
    phoneService
      .update(person.id, changedPerson)
      .then(returnedPerson => {

        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        setNewNumber('')

      }).catch(() => {

        infoHeader(`${name} was already deleted from the server`, true)
        setPersons(persons.filter(p => p.name !== name))

      })

  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if (persons.some(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the older number with a new one?`)) {
        updateNumber(newName, newNumber)
        infoHeader(`Updated ${newName}'s number`, false)
      }

    }
    else {

      phoneService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        }).catch(error => {
          console.log(error.response.data.error)
          setIsErrorMessage(true)
          infoHeader(`${error.response.data.error}`, true)
        })
      if (!isErrorMessage) { infoHeader(`Added ${newName}`, false) }
    }

  }

  const infoHeader = (text, isError) => {

    setIsErrorMessage(isError)
    setHeaderMessage(text)
    setNewName('')
    setNewNumber('')
    setTimeout(() => {
      setHeaderMessage(null)
    }, 3000)

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilterBy(event.target.value)
  }




  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={headerMessage} isError={isErrorMessage} />
      <Filter filterBy={filterBy} filterFunc={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        nameChange={handleNameChange}
        numChange={handleNumberChange}

      />

      <h3>Numbers</h3>
      <Persons persons={persons} filterBy={filterBy} deleteFunc={deleteEntry} />
    </div>
  )
}


const Notification = ({ message, isError }) => {

  let errorStyle = {

    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 400


  }

  if (message === null) {
    return null
  }

  if (!isError) {

    errorStyle = { ...errorStyle, color: 'green' }
    //errorStyle.color = 'green'
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )

}

const Person = ({ person, deleteFunc }) => {
  return (

    <div>
      <p>{person.name} {person.number} <button onClick={deleteFunc}>delete</button> </p>

    </div>
  )

}

const Persons = ({ persons, filterBy, deleteFunc }) => {

  const del = (name, id) => {

    if (window.confirm(`Are you sure you want to delete ${name}?`)) { deleteFunc(id) }

  }

  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(
        filterBy.toLowerCase()))
        .map((person) =>
          <Person key={person.name} person={person} deleteFunc={
            () => del(person.name, person.id)
          } />
        )}

    </div>
  )


}
const PersonForm = ({ addPerson, name, number, nameChange, numChange }) => {
  return (

    <form onSubmit={addPerson}>

      <FormInput text={'name: '} value={name} onChange={nameChange} />
      <FormInput text={'number: '} value={number} onChange={numChange} />

      <div>
        <button type="submit">add</button>
      </div>
    </form>

  )
}

const FormInput = ({ text, value, onChange }) => {
  return (
    <div>
      {text}
      <input
        value={value}
        onChange={onChange}
      />

    </div>



  )
}

const Filter = ({ filterBy, filterFunc }) => {
  return (
    <div>
      filter names:
      <input
        value={filterBy}
        onChange={filterFunc}
      />

    </div>
  )
}

export default PhonebookApp