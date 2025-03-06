import React, { useState, useEffect, useCallback } from "react";
import { Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../App.css";
import ModalGrupo from "../../modales/ModalGrupo";
import { fetchGroups, confirmDelete } from "../../services/groupService";

const DashboardGrup = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const loadGroups = useCallback(() => {
    fetchGroups(navigate, setGroups);
  }, [navigate]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const openEditModal = (group) => {
    setGroupToEdit(group);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setGroupToEdit(null);
  };

  const navigateToGroupTasks = (groupId) => {
    navigate(`/grupos/${groupId}/tareas`);
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1>Grupos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Nuevo grupo
        </Button>
        <ModalGrupo
          isVisible={isModalVisible}
          groupToEdit={groupToEdit}
          onClose={closeModal}
          fetchGroups={loadGroups}
        />
        <div className="groups-container">
          {groups.map((group) => (
            <Card
              key={group.id}
              title={group.nombreGrupo}
              extra={
                <div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(group)}
                  >
                    Editar
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => confirmDelete(group.id, loadGroups, navigate)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => navigateToGroupTasks(group.id)}
                  >
                    Tareas
                  </Button>
                </div>
              }
            >
              <p>
                <strong>Creador:</strong> {group.creadorNombre || group.creadorId}
              </p>
              <p>
                <strong>Usuarios Asignados:</strong>
              </p>
              <ul>
                {group.usuarios
                  ?.filter((user) => user && user.usuario && user.email)
                  .map((user) => (
                    <li key={user.id}>
                      {user.usuario} - {user.email}
                    </li>
                  ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardGrup;