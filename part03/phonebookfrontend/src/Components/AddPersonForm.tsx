import React from "react";

export const AddPersonForm = ({handleAddNewName, newName, handleChangeName, newNumber, handleChangeNumber}) => {
  return <>
    <h2>Add a new</h2>
    <form onSubmit={handleAddNewName}>
      <div>
        name: <input value={newName} onChange={handleChangeName} />
      </div>
      <div>
        number:{" "}
        <input type="number" value={newNumber} onChange={handleChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>;
};