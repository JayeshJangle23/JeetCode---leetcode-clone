import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://jeetcode-leetcode-clone-wcsw.onrender.com", // ✅ NEW URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
