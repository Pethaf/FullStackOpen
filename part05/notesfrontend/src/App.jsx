import { useState, useEffect } from "react";
import Note from "./Components/Note";
import Login from "./Components/Login";
import noteService from "./Services/notes";
import loginService from "./Services/login";
import NotifyFailure from "./Components/NotifyFailure";
import NotifySuccess from "./Components/NotifySuccess";
import DisplayNotes from "./Components/DisplayNotes";
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: userName,
        password: password,
      });
      setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        console.log(error);
        alert(`the note '${note.content}' was already deleted from server`);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>

      {errorMessage !== null  && <NotifyFailure message={errorMessage} />}
      {token === null &&  (
        <Login
          handleLogin={handleLogin}
          password={password}
          updatePassword={setPassword}
          username={userName}
          updateUsername={setUsername}
        />
      )}
      {token !== null && 
      <>      <h2>Add new note</h2>
      <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange} />
          <button type="submit">save</button>
        </form>
      </>
      }
            <DisplayNotes notes = {notes} toggleImportanceOf={toggleImportanceOf} />

    </div>
  )
}

export default App;
