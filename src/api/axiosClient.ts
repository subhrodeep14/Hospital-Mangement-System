import axios from "axios";

export const axiosClient = axios.create({
  baseURL:  import.meta.env.URL,
  withCredentials: true, // VERY IMPORTANT for cookies
});
