import { useState, useEffect } from "react";
import { Persons } from "./Components/Persons";
import { AddPersonForm } from "./Components/AddPersonForm";
import { FilterInput } from "./Components/FilterInput";
import { ShowSuccess } from "./Components/ShowSuccess";
import { ShowError } from "./Components/ShowError";
import peopleService from "./services/people";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [showFailure, setShowFailure] = useState(false);
  const handleSuccessMessage = (message) => {
    setShowSuccess(true);
    setSuccessMessage(message);
    setTimeout(() => {
      setShowSuccess(false);
      setFailureMessage("");
    }, 2500);
  };
  const handleFailureMessage = (message) => {
    setShowFailure(true);
    setFailureMessage(message);
    setTimeout(() => {
      setShowFailure(false);
      setFailureMessage("");
    }, 2500);
  };
  const deletePerson = (personId) => {
    const personToDelete = persons.find((person) => person.id === personId);
    if (window.confirm(`Delete ${personToDelete.name}`)) {
      peopleService
        .deletePerson(personToDelete.id)
        .then((resp) => {
          if (resp.status === 200) {
            handleSuccessMessage(`${personToDelete.name} successfully deleted`);
            setPersons([
              ...persons.filter((person) => person.id !== personToDelete.id),
            ]);
          }
        })
        .catch((_) => handleFailureMessage("Something went wrong"));
    }
  };
  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };

  const handleAddNewPerson = () => {
    peopleService
      .createPerson({ name: `${newName}`, number: `${newNumber}` })
      .then((resp) => {
        if (resp.status === 200) {
          handleSuccessMessage(`${newName} successfully added`);
          peopleService.getAll().then((resp) => {
            setPersons(resp.data);
            setNewName("");
            setNewNumber("");
          });
        }
      })
      .catch((error) => {
        console.log(error.response.data.error);
        handleFailureMessage(error.response.data.error);
      });
  };

  const handleUpdatePerson = (personToUpdate) => {
    if (
      window.confirm(
        `${personToUpdate.name} is already in phonebook replace old number with new one?`
      )
    ) {
      const newPerson = {
        ...personToUpdate, 
        number: `${newNumber}`
      }
      peopleService
        .updatePerson(newPerson)
        .then((resp) => {
          if (resp.status === 200) {
            handleSuccessMessage(`${newPerson.name.trim()} updated succesfully`);
            peopleService.getAll().then((resp) => {
              if (resp.status === 200) {
                setPersons(resp.data);
                setNewName("");
                setNewNumber("");
              }
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data.error);
          handleFailureMessage(error.response.data.error);
        });
    }
  };

  const handleAddNewName = (e) => {
    e.preventDefault();
    const oldPerson = persons.find((person) => person.name.toLowerCase() === newName.trim().toLowerCase())
    if (oldPerson) {
      handleUpdatePerson(oldPerson);
    } else {
      handleAddNewPerson();
    }
  };

  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value);
  };
  const handleChangeFilterTerm = (e) => {
    setFilterTerm(e.target.value);
  };

  const peopleToDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(filterTerm.toLowerCase())
  );
  useEffect(() => {
    peopleService.getAll().then((resp) => {
      setPersons(resp.data);
    });
  }, []);
  return (
    <div>
      <h1>Phonebook</h1>
      {showSuccess && <ShowSuccess message={successMessage} />}
      {showFailure && <ShowError message={failureMessage} />}
      <h2>Search</h2>
      <FilterInput
        filterTerm={filterTerm}
        handleChangeFilterTerm={handleChangeFilterTerm}
      />

      <AddPersonForm
        handleAddNewName={handleAddNewName}
        newName={newName}
        handleChangeName={handleChangeName}
        newNumber={newNumber}
        handleChangeNumber={handleChangeNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={peopleToDisplay} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
