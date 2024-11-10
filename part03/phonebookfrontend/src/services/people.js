import axios from "axios"; 
const baseUrl = "/api/persons/"
const getAll = () => {
    return axios.get(baseUrl)
}

const create = newPerson => {
    return axios.post(baseUrl,newPerson)
}
const deletePerson = (personId) =>{
    return axios.delete(`${baseUrl}${personId}`)
}
const updatePerson = (updatedPerson) => {
    return axios.put(`${baseUrl}${updatedPerson.id}`,updatePerson)
}
export default {
    getAll, create, deletePerson,updatePerson
}