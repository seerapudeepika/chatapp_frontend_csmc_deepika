import axios from "axios";
const API = axios.create({
  baseURL: "https://chatapp-backend-4-wfkr.onrender.com",
});
export default API;
