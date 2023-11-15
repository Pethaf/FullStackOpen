
const baseUrl = `https://cors-anywhere.herokuapp.com/:https://api.openweathermap.org/data/3.0/onecall`

import axios from "axios"
const getWeather =(latitude, longitude) => {
    const request = axios.get(`${baseUrl}/lat=${latitude}&long=${longitude}&appid=`)
    return request.then(result => result.data)
}

export default {
    getWeather
}