import axios from "axios";
const API = axios.create({
  baseURL: "https://chatapp-backend-csmc-deepika.onrender.com",
});
export default API;
