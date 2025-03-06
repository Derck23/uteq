import api from "./api";
import { message } from "antd";

export const fetchTasks = async (groupId) => {
    try {
      const response = groupId 
        ? await api.get(`/tareas?groupId=${groupId}`)  // Filtra tareas del grupo
        : await api.get("/tareas");  // Tareas personales
  
      console.log("Tareas recibidas:", response.data);
      return response.data.data || [];
    } catch (error) {
      message.error("Error al cargar las tareas");
      console.error("Error en fetchTasks:", error);
      return [];
    }
  };
  

export const deleteTask = async (id, fetchTasksCallback) => {
  try {
    await api.delete(`/tareas/${id}`);
    message.success("Tarea eliminada con éxito");
    fetchTasksCallback(); // Recargar las tareas después de eliminar
  } catch (error) {
    message.error(error.response?.data?.intMessage || "Error al eliminar la tarea");
  }
};