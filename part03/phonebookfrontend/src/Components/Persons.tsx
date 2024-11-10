import React from "react";
import { Person } from "./Person";
export const Persons = ({Persons,deletePerson}) => {
    return <ul>
        {Persons.map((person) => (
          <Person key={person.id} {...person} deletePerson={deletePerson} />
        ))}
      </ul>
}