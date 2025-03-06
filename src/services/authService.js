import api from "./api";

export const registerUser = async (email, username, password) => {
    try {
        const response = await api.post("/registro", { 
            usuario: username,  // Cambiar `username` a `usuario`
            correo: email,      // Cambiar `email` a `correo`
            contra: password    // Cambiar `password` a `contra`
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error en el registro. Intente nuevamente.";
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await api.post("/acceso", { usuario: username, contra: password });
        if (response.data && response.data.token && response.data.data && response.data.data.rol) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", username);
            localStorage.setItem("rol", response.data.data.rol); // Almacenar el rol del usuario
            return response.data;
        } else {
            throw new Error("Respuesta de inicio de sesión inválida");
        }
    } catch (error) {
        throw error.response?.data?.intMessage || "Error en el inicio de sesión";
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
};
