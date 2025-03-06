import React, { useState, useEffect, useCallback } from "react";
import { Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../App.css";
import Modalusuario from "../../modales/Modalusuario";
import { fetchUsers, deleteUser } from "../../services/userService";

const DashboardUsers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = useCallback(() => {
    fetchUsers(setUsers, navigate);
  }, [navigate]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteUser = async (id) => {
    await deleteUser(id, loadUsers);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setUserToEdit(null);
    setIsModalVisible(false);
  };

  return (
    <MainLayout>
      <h1>Gestión de Usuarios</h1>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        className="boton-flotante"
        onClick={() => setIsModalVisible(true)}
      />

      <Modalusuario
        visible={isModalVisible}
        onClose={closeModal}
        userToEdit={userToEdit}
        fetchUsers={loadUsers}
      />

      <div style={{ marginTop: "20px" }}>
        {users.map((user) => (
          <Card key={user.id} title={user.username} style={{ marginBottom: "10px" }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.rol}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(user)}>Editar</Button>
              <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default DashboardUsers;
