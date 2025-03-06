import api from "./api";
import { message } from "antd";

// Función para manejar la creación o actualización de usuarios
export const handleUserSave = async (form, userToEdit, fetchUsers, onClose) => {
  try {
    const values = await form.validateFields();

    if (userToEdit) {
      await api.put(`/usuarios/${userToEdit.id}`, values);
      message.success("Usuario actualizado con éxito");
    } else {
      await api.post("/usuarios", values);
      message.success("Usuario creado con éxito");
    }

    fetchUsers();
    form.resetFields();
    onClose();
  } catch (error) {
    message.error(error.response?.data?.intMessage || "Error al guardar el usuario");
  }
};

// Función para inicializar los valores del formulario
export const initializeUserForm = (form, userToEdit) => {
  if (userToEdit) {
    form.setFieldsValue({
      username: userToEdit.username,
      email: userToEdit.email,
      rol: userToEdit.rol,
    });
  } else {
    form.resetFields();
  }
};
