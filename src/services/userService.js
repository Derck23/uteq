import api from "./api";
import { message } from "antd";

// Obtener usuarios
export const fetchUsers = async (setUsers, navigate) => {
  try {
    const response = await api.get("/usuarios");
    console.log("Usuarios recibidos:", response.data);
    setUsers(response.data.data || []);
  } catch (error) {
    if (error.response?.status === 401) {
      message.error("No autorizado, inicia sesión nuevamente.");
      navigate("/login");
    } else {
      message.error("Error al cargar los usuarios");
    }
  }
};

// Eliminar usuario
export const deleteUser = async (id, fetchUsersCallback) => {
  try {
    await api.delete(`/usuarios/${id}`);
    message.success("Usuario eliminado con éxito");
    fetchUsersCallback(); // Recargar la lista después de eliminar
  } catch (error) {
    message.error("Error al eliminar el usuario");
  }
};
