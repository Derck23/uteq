import api from "./api";
import { message } from "antd";
import dayjs from "dayjs";

// Función para manejar la creación o actualización de tareas
export const handleTaskSave = async (form, taskToEdit, usuario, fetchTasks, onClose, groupId, groupMembers) => {
  try {
    const values = await form.validateFields();
    values.fechaLimite = values.fechaLimite.format("YYYY-MM-DD");

    const taskData = {
      ...values,
      usuario,
    };

    if (groupId && groupMembers) {
      // Si es una tarea de grupo
      taskData.grupoId = groupId;
      const selectedMember = groupMembers.find(member => member.id === values.usuarioAsignadoId);
      taskData.usuarioAsignadoNombre = selectedMember ? selectedMember.usuario : null;
    }

    if (taskToEdit) {
      await api.put(`/tareas/${taskToEdit.id}`, taskData);
      message.success("Tarea actualizada con éxito");
    } else {
      await api.post("/tareas", taskData);
      message.success("Tarea creada con éxito");
    }

    fetchTasks();
    form.resetFields();
    onClose();
  } catch (error) {
    message.error(error.response?.data?.intMessage || "Error al guardar la tarea");
  }
};

// Función para inicializar los valores del formulario
export const initializeForm = (form, taskToEdit) => {
  if (taskToEdit) {
    form.setFieldsValue({
      titulo: taskToEdit.titulo,
      descripcion: taskToEdit.descripcion,
      fechaLimite: dayjs(taskToEdit.fechaLimite),
      estado: taskToEdit.estado,
      categoria: taskToEdit.categoria,
      usuarioAsignadoId: taskToEdit.usuarioAsignadoId,
    });
  } else {
    form.resetFields();
  }
};
