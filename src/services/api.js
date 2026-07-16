import axios from "axios";
const API = axios.create({
  baseURL: "https://chatapp-backend-csmc-deepika-1.onrender.com",
});
export default API;
