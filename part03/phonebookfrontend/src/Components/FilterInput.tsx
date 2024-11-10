import React from "react";

export const FilterInput = ({filterTerm, handleChangeFilterTerm}) => {
    return <input value={filterTerm} onChange={handleChangeFilterTerm}/>
}