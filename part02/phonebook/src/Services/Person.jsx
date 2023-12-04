import axios from "axios"
const baseUrl = `/api/persons`
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
    return theRequest.then(result => result.data);
}

export default { getAll, create, remove, update}