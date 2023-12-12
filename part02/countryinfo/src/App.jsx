import { useState, useEffect } from "react";
import { Filter } from "./Components/Filter";
import { CountriesContainer } from "./Components/CountriesContainer";
import countryService from "./Services/Countries";
const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    countryService.getAllCountries().then(
      data => setAllCountries(data)
    )
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }


  return (
    <>
      <Filter value={searchTerm} onChange={handleChange} />
      <CountriesContainer countries={allCountries.filter(country => country.name.common.toLowerCase().includes(searchTerm.toLowerCase() ))} changeSearchTerm={setSearchTerm} />
    </>
  )
}

export default App;