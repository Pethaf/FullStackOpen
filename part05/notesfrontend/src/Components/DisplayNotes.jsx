import { useState } from "react";
import Note from "../Components/Note"
const DisplayNotes = ({notes, toggleImportanceOf}) => {
    const [showAll, setShowAll] = useState(true)
    const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important);
    return (
        <>
        <h2>Notes in Database</h2>
    <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => {
              toggleImportanceOf(note.id);
            }}
          />
        ))}
      </ul>
      </>
    )
}

export default DisplayNotes;

