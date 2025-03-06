import React, { useEffect, useState, useCallback } from "react";
import { Button, Card } from "antd";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ModalTaskForm from "../../modales/ModalTaskForm";
import { fetchTasks, deleteTask } from "../../services/taskService";
import { fetchGroupMembers } from "../../services/groupService";
import useModal from "../../services/useModal"; // Importa el hook para manejar el modal

const GroupTasksView = () => {
  const { groupId } = useParams();  // Obtén el groupId de la URL
  const [tasks, setTasks] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const { isVisible, taskToEdit, open, close } = useModal(); // Usa el hook para manejar el modal

  // Definir fetchData usando useCallback para evitar cambios en cada render
  const fetchData = useCallback(async () => {
    // Pasa el groupId si existe, de lo contrario carga las tareas personales
    const tasksData = await fetchTasks(groupId); 
    const membersData = groupId ? await fetchGroupMembers(groupId) : [];  // Solo carga los miembros si hay un grupo

    setTasks(tasksData);
    setGroupMembers(membersData);
  }, [groupId]);

  // Cargar tareas y miembros del grupo al montar el componente
  useEffect(() => {
    fetchData();
  }, [groupId, fetchData]);

  const handleDeleteTask = async (id) => {
    await deleteTask(id, fetchData);
  };

  return (
    <MainLayout>
      <div>
        <h1>Tareas del {groupId ? `Grupo ${groupId}` : "Usuario"}</h1>
        <Button type="primary" onClick={() => open()}>
          Nueva Tarea
        </Button>
        <ModalTaskForm
          visible={isVisible}
          onClose={close}
          taskToEdit={taskToEdit}
          fetchTasks={fetchData}
          groupId={groupId}
          groupMembers={groupMembers}
        />
        {tasks.map((task) => (
          <Card key={task.id} title={task.titulo}>
            <p>Descripción: {task.descripcion}</p>
            <p>Fecha límite: {task.fechaLimite}</p>
            <p>Estado: {task.estado}</p>
            <p>Categoría: {task.categoria}</p>
            <p>Usuario asignado: {task.usuarioAsignadoNombre}</p>
            <Button type="primary" onClick={() => open(task)}>
              Editar
            </Button>
            <Button type="danger" onClick={() => handleDeleteTask(task.id)}>
              Eliminar
            </Button>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default GroupTasksView;
