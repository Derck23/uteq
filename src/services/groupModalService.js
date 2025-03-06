import api from "./api";
import { message } from "antd";

// Manejo de errores centralizado
const handleAxiosError = (error, customMessage) => {
  if (error.response?.status === 401) {
    message.error("No autorizado, inicia sesión nuevamente.");
  } else {
    message.error(customMessage || "Error en la operación.");
  }
  console.error(customMessage || "Error de Axios:", error);
};

// Obtener lista de usuarios
export const fetchUsers = async (setUsers, setLoadingUsers) => {
  setLoadingUsers(true);
  try {
    const response = await api.get("/usuarios");
    setUsers(response.data.data.filter((user) => user?.id));
  } catch (error) {
    handleAxiosError(error, "Error al cargar los usuarios");
  } finally {
    setLoadingUsers(false);
  }
};

// Inicializar formulario
export const initializeGroupForm = (form, groupToEdit) => {
  if (groupToEdit) {
    form.setFieldsValue({
      nombreGrupo: groupToEdit.nombreGrupo || "",
      usuarios: groupToEdit.usuarios?.map((u) => u.id) || [],
    });
  } else {
    form.resetFields();
  }
};

// Guardar o actualizar grupo
export const handleGroupSave = async (values, users, groupToEdit, fetchGroups, onClose, form) => {
  try {
    const usuariosConDetalles = values.usuarios.map((id) => {
      const usuario = users.find((u) => u.id === id);
      return usuario ? { id: usuario.id, usuario: usuario.username, email: usuario.email } : null;
    }).filter(Boolean);

    const grupoData = { ...values, usuarios: usuariosConDetalles };

    if (groupToEdit) {
      await api.patch(`/grupos/${groupToEdit.id}`, grupoData);
      message.success("Grupo actualizado con éxito");
    } else {
      await api.post("/grupos", grupoData);
      message.success("Grupo creado con éxito");
    }

    form.resetFields();
    fetchGroups();
    onClose();
  } catch (error) {
    handleAxiosError(error, "Error al guardar el grupo");
  }
};
