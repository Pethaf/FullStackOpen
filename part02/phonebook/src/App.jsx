import personService from './Services/Person';
import { useState, useEffect } from 'react'
import { FilterInput } from './Components/FilterInput'
import { AddPersonInput } from './Components/AddPersonInputs'
import { FilteredPhoneList } from './Components/FilteredPhoneList'
const App = () => {
  useEffect(
    () => {
      personService.getAll().then(initialPeople => { setPersons(initialPeople) });
    }, [])
  const [persons, setPersons] = useState([])
  const [number, setNumber] = useState("")
  const [newName, setNewName] = useState('')
  const [filterTerm, setFilterTerm] = useState("")
  const addPerson = () => {
    const person = persons.find(person => person.name == newName);
    if (!person) {
      const newPerson = { name: `${newName}`, number: `${number}` }
      personService.create(newPerson).then(response => {
        setPersons([...persons, { ...response }])
        setNumber("");
        setNewName("");
      })
    }
    else {
      const confirmUpdatePerson = confirm(`${person.name} is already added to phonebook, replace old number with new one?`)
      if(confirmUpdatePerson){
        const newPerson = {...person, number}
        personService.update(newPerson).then(
          response => {
            const indexOfPerson = persons.findIndex(person => person.id == newPerson.id);
            let newPersons = [...persons]
            newPersons[indexOfPerson] = {...newPerson}
            setPersons(newPersons);
          } 
 
        )
      }
      setNewName("")
      setNumber("")
    }
  }

  const deletePerson = (id) => {
    const userToDelete = persons.find(person => person.id == id)
    const confirmDeleteUser = confirm(`Really delete ${userToDelete.name}`)
    if (confirmDeleteUser) {
      personService.remove(id).then(
        (_) => {
          setPersons(persons.filter(person => person.id != id))
        }
      )
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={e => {
        e.preventDefault();
        addPerson();
      }}>
        <FilterInput callback={setFilterTerm} filterValue={filterTerm} />
        <AddPersonInput newName={newName} number={number} setNewName={setNewName} setNumber={setNumber} />
        <FilteredPhoneList people={persons} filterTerm={filterTerm} deletePerson={deletePerson} />
      </form>

    </div>
  )
}

export default App