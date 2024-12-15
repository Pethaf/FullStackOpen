import React from "react";
import { Person } from "./Person";
export const Persons = ({persons,deletePerson}) => {
    return <ul>
        {persons.map((person) => (
          <Person key={person.id} {...person} deletePerson={deletePerson} />
        ))}
      </ul>
}