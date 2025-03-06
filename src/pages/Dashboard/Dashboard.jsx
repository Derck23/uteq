import React, { useState, useEffect, useCallback } from "react";
import { Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import "../../App.css";
import ModalTaskForm from "../../modales/ModalTaskForm";
import { fetchTasks, deleteTask } from "../../services/taskService"; // Importamos el servicio de tareas

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);

  const loadTasks = useCallback(async () => {
    const tasksData = await fetchTasks();
    setTasks(tasksData);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDeleteTask = async (id) => {
    await deleteTask(id, loadTasks);
  };

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.estado]) acc[task.estado] = [];
    acc[task.estado].push(task);
    return acc;
  }, {});

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setTaskToEdit(null);
    setIsModalVisible(false);
    setGroupId(null);
    setGroupMembers(null);
  };

  return (
    <MainLayout>
      <h1>Dashboard</h1>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        className="boton-flotante"
        onClick={() => setIsModalVisible(true)}
      />

      <ModalTaskForm
        visible={isModalVisible}
        onClose={closeModal}
        usuario={localStorage.getItem("userId")}
        taskToEdit={taskToEdit}
        fetchTasks={loadTasks}
        groupId={groupId}
        groupMembers={groupMembers}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "20px" }}>
        {Object.entries(groupedTasks).map(([estado, tareas]) => (
          <div key={estado} style={{ flex: 1 }}>
            <h2>{estado}</h2>
            {tareas.map((task) => (
              <Card key={task.id} title={task.titulo} style={{ marginBottom: "10px" }}>
                <p><strong>Descripción:</strong> {task.descripcion}</p>
                <p><strong>Fecha límite:</strong> {task.fechaLimite}</p>
                <p><strong>Categoría:</strong> {task.categoria}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(task)}>Editar</Button>
                  <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteTask(task.id)}>Eliminar</Button>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;