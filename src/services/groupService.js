import api from "./api";
import { message, Modal } from "antd";

// Obtener grupos
export const fetchGroups = async (navigate, setGroups) => {
  const userId = localStorage.getItem("userId");

  try {
    const response = await api.get("/grupos", {
      params: { creadorId: userId },
    });

    console.log("Grupos recibidos:", response.data);

    const groupsWithCreatorNames = await Promise.all(
      response.data.data.map(async (group) => {
        try {
          if (!group.creadorId) {
            return { ...group, creadorNombre: "Creador no especificado" };
          }

          const userResponse = await api.get(`/usuarios/${group.creadorId}`);
          return { ...group, creadorNombre: userResponse.data.username };
        } catch (userError) {
          console.warn(`Error obteniendo creador del grupo ${group.creadorId}:`, userError);
          return { ...group, creadorNombre: "Usuario desconocido" };
        }
      })
    );

    setGroups(groupsWithCreatorNames);
  } catch (error) {
    if (error.response?.status === 404) {
      message.error("No se encontraron grupos");
    } else if (error.response?.status === 401) {
      message.error("No autorizado, inicia sesión nuevamente.");
      navigate("/login");
    } else {
      message.error("Error al cargar los grupos");
      console.error("Error en fetchGroups:", error);
    }
  }
};

// Eliminar grupo
export const deleteGroup = async (id, fetchGroupsCallback, navigate) => {
  try {
    await api.delete(`/grupos/${id}`);
    message.success("Grupo eliminado con éxito");
    fetchGroupsCallback();
  } catch (error) {
    if (error.response?.status === 404) {
      message.error("Grupo no encontrado");
    } else if (error.response?.status === 401) {
      message.error("No autorizado, inicia sesión nuevamente.");
      navigate("/login");
    } else {
      message.error("Error al eliminar el grupo");
      console.error("Error en deleteGroup:", error);
    }
  }
};

// Confirmar eliminación de grupo
export const confirmDelete = (id, fetchGroupsCallback, navigate) => {
  Modal.confirm({
    title: "¿Estás seguro de eliminar este grupo?",
    content: "Esta acción no se puede deshacer.",
    onOk() {
      deleteGroup(id, fetchGroupsCallback, navigate);
    },
    onCancel() {},
  });
};

export const fetchGroupMembers = async (groupId) => {
  const token = localStorage.getItem("token");

  try {
      const response = await api.get(`/grupos/${groupId}/miembros`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Miembros del grupo:", response.data);
      return response.data.data || [];
  } catch (error) {
      console.error("Error en fetchGroupMembers:", error);
      return [];
  }
};