import { useState, useEffect } from "react"
import WeatherService from "../Services/WeatherService"
const Country = ({name, capital, area, languages, flags, capitalInfo}) => {
    const [weather, setWeather] = useState("")
    useEffect(() => {WeatherService.getWeather(capitalInfo.latlng[0], capitalInfo.latlng[1]).then(weather => setWeather(weather))},[])
    if(!weather){
        return <p>Loading Weather</p>
    }
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
        <div>
        <p>Temperature: {weather && weather.main.temp} °C</p>
        <img alt="weather" src={`icons/${weather.weather[0].icon}.png`}/>
        <p>Wind: {weather && weather.wind.speed} m/s </p>
        </div>
       </>
    )
}

export { Country}