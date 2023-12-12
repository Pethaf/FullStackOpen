import axios from "axios";
const baseUrl = `https://studies.cs.helsinki.fi/restcountries/`;
const getAllCountries =() => {
    return returnData(axios.get(`${baseUrl}/api/all`))
}
const getCountryByName =(countryName) => {
    return returnData(axios.get(`${baseUrl}/api/name/${countryName}`))
}
const returnData = (theRequest) => {
    return theRequest.then(result => result.data)
}

export default{
    getAllCountries, getCountryByName
}