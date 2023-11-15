import { Country } from "./Country"

const CountriesContainer = ({countries,changeSearchTerm}) => {
  if(countries.length > 10){
        return (
            <p>
              Too many matches, specify another filter
            </p>
        )
    }
    else if(countries.length >1){
        return <ul>
            {countries.map(country => <li key={country.name.common}>{country.name.common}<button onClick={() => changeSearchTerm(country.name.common)}>show</button></li>)}
        </ul>}
    else if(countries.length == 1){
        return <Country {...countries[0]} />
    }
    else if(countries.length == 0){
        return <p>No country found</p>
    }
}


export { CountriesContainer}