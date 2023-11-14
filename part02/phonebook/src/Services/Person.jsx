import axios from "axios"
const baseUrl = `http://localhost:3001/persons`
const getAll = () => {
  const request = axios.get(baseUrl);
    return returnData(request);
}

const create = (person) => {
    const request = axios.post(baseUrl, person)
    return returnData(request)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return returnData(request);

}

const update = (person) => {
    const request = axios.put(`${baseUrl}/${person.id}`,person);
    return returnData(request)
}

const returnData = (theRequest) => {
    return theRequest.then(response => response.data);
}

export default { getAll, create, remove, update}