import { useState, useEffect } from "react";
import { Filter } from "./Components/Filter";
import { CountriesContainer } from "./Components/CountriesContainer";
import countryService from "./Services/Countries";
const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    countryService.getAllCountries().then(
      data => setAllCountries(data)
    )
  }, [])
  useEffect(() => {
    const filteredCountries = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCountries(filteredCountries)
  }, [searchTerm])
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }


  return (
    <>
      <Filter value={searchTerm} onChange={handleChange} />
      <CountriesContainer countries={filteredCountries} changeSearchTerm={setSearchTerm} />
    </>
  )
}

export default App;