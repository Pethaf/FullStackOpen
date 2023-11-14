const Person = ({name, number, deletePerson}) => {
    return <><p>{name} {number}
    <button onClick={(e) => {e.preventDefault(); deletePerson();}}>X</button>
    </p></>
}

export {Person}