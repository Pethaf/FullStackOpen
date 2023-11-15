import { useState, useEffect } from "react"
import WeatherService from "../Services/WeatherService"
const Country = ({name, capital, area, languages, flags, capitalInfo}) => {
    const [weather, setWeather] = useState("")
    useEffect(() => {WeatherService.getWeather(capitalInfo.latlng[0], capitalInfo.latlng[1]).then(result => result.data).then(data => console.log(data))},[])
    return (
        <>
       <h2>{name.common}</h2>
       <p>Capital: {capital}</p>
       <p>Area: {area}</p>
       <h3>languages:</h3>
       <ul>
            {Object.values(languages).map(language => <li key={language}>{language}</li>)}
       </ul>
       <img src={flags.png} alt={flags.alt}/>
       <h2>Weather in {capital}</h2>
        
       </>
    )
}

export { Country}