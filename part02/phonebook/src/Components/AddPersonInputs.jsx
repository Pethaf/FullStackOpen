const AddPersonInput = ({setNewName, setNumber, newName, number}) => {
    return (
    <><div>
            name: <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />

        </div>
        <div>number: <input type="text" value={number} onChange={e => { setNumber(e.target.value) } } /></div><div>
                <button type="submit">add</button>
        </div>
    </>
        )
}

export {AddPersonInput}