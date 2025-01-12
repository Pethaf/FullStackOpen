import axios from "axios";
const baseUrl = "/api/login"
const login = async credentials => {
    console.log(`Logging in ${credentials.username} ${credentials.password}`)
  }
export default{
    login
}
