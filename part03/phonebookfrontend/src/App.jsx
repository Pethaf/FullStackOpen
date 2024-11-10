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
  const handleAddNewName = (e) => {
    e.preventDefault();
    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already in phonebook replace old number with new one?`
        )
      ) {
        const updatedPerson = {
          ...persons.find(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
          ),
          number: newNumber,
        };
        peopleService
          .updatePerson(updatedPerson)
          .then((resp) => {
            if (resp.status === 200) {
              handleSuccessMessage(`${updatedPerson.name} updated succesfully`);
              peopleService.getAll().then((resp) => {
                if (resp.status === 200) {
                  setPersons(resp.data);
                  setNewName("");
                  setNewNumber("");
                }
              });
            }
          })
          .catch((_) => {
            handleFailureMessage("Something went wrong");
          });
      }
    } else {
      peopleService
        .create({
          name: newName,
          number: newNumber,
        })
        .then((resp) => {
          if (resp.status === 200) {
            handleSuccessMessage(`${newName} created successfully `);
            peopleService.getAll().then((resp) => setPersons([...resp.data]));
            setNewName("");
            setNewNumber("");
          }
        })
        .catch((_) => {
          handleFailureMessage("Something went wrong");
        });
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
      <Persons Persons={peopleToDisplay} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
