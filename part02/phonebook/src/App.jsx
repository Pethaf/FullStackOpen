import { useState } from 'react'
import { FilterInput } from './Components/FilterInput'
import { AddPersonInput } from './Components/AddPersonInputs'
import { FilteredPhoneList } from './Components/FilteredPhoneList'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number:"040-1234567", id: 0}, 
    {name: "Ada Lovelace", number: "021-0320525", id:1},
  ]) 
  const [number, setNumber] = useState("")
  const [newName, setNewName] = useState('')
  const [filterTerm, setFilterTerm] = useState("")
  const addPerson = () => {
    let indexOfPerson = -1; 
    persons.forEach((person,index) => {
      if(person.name == newName){
        indexOfPerson = index
      }
    })
    if(indexOfPerson ==-1){
      setPersons([...persons, {name:newName, number: number, id:persons.length}])
      setNumber("");
      setNewName("");
    }
    else {
      alert(`${newName} allready exists in phonebook`)
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={e => {
        e.preventDefault(); 
        addPerson();
      }}>
        <FilterInput callback={setFilterTerm} filterValue={filterTerm}/>
        <AddPersonInput newName={newName} number={number} setNewName={setNewName} setNumber={setNumber}/>
        <FilteredPhoneList people={persons} filterTerm={filterTerm} />
      </form>
     
    </div>
  )
}

export default App