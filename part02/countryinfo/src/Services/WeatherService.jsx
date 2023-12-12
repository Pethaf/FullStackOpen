const BASE_URL = "http://localhost:3001"

import axios from "axios"
const getWeather =(latitude, longitude) => {
    return axios.get(`${BASE_URL}/api/weather?latitude=${latitude}&longitude=${longitude}`).then(resp => resp.data);
}

export default {
    getWeather
}