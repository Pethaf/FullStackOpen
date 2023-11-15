const Filter = ({value,onChange}) => {
    return <label> find countries
      <input type="text" value={value} onChange={onChange }/>
      </label>
}

export {Filter}