import React from "react";

export const Person = ({ name, number,deletePerson,id }) => 
  <li>{name} {number}  <span onClick={(e) => deletePerson(id)}>X</span> </li>
