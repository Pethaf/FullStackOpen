import axios from "axios"; 
const baseUrl = "/api/persons/"
const getAll = () => {
    return axios.get(baseUrl)
}

const createPerson = newPerson => {
    return axios.post(baseUrl,newPerson)
}
const deletePerson = (personId) =>{
    return axios.delete(`${baseUrl}${personId}`)
}

const updatePerson = (updatedPerson) => {
    return axios.put(`${baseUrl}${updatedPerson.id}`,updatedPerson)
}
export default {
    getAll, createPerson, deletePerson,updatePerson
}