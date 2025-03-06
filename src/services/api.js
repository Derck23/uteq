import axios from "axios";

const API_URL = "https://back-tast-manager.onrender.com/api";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANTE: Solo funcionará si el backend lo permite
});

// Interceptor para adjuntar el token en cada petición
api.interceptors.request.use(
  async (config) => {
    console.log("Request interceptor");
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.debug("Returning interceptor configuration");
    return config;
  },
  (error) => {
    console.error("Request interceptor error", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response, // Deja pasar respuestas exitosas sin cambios
  (error) => {
    console.error("Response interceptor error:", error);

    if (error.response && error.response.status === 401) {
      console.warn("Token expirado o no válido, cerrando sesión...");

      // Eliminar token y otros datos del usuario
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");

      // Redirigir al login si es necesario
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
