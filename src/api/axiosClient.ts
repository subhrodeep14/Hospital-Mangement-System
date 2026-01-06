import axios from "axios";

export const axiosClient = axios.create({
  baseURL:  import.meta.env.URL || "http://localhost:4000/api",
  withCredentials: true, // VERY IMPORTANT for cookies
});
