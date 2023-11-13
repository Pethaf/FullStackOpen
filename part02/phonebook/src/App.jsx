import axios from 'axios'
import { useState, useEffect } from 'react'
import { FilterInput } from './Components/FilterInput'
import { AddPersonInput } from './Components/AddPersonInputs'
import { FilteredPhoneList } from './Components/FilteredPhoneList'
const App = () => {
  useEffect(
    () => {
      try {
      axios.get('http://localhost:3001/persons').then(res => 
        setPersons([...res.data])
      );

      }
      catch (err){
        console.log(err);
      }
    }, []
  )
  const [persons, setPersons] = useState([]) 
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