import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://dogeshbook.onrender.com/api"
      : "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
