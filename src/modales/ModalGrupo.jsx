import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { fetchUsers, initializeGroupForm, handleGroupSave } from "../services/groupModalService";

const { Option } = Select;

const ModalGrupo = ({ isVisible, onClose, groupToEdit, fetchGroups }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchUsers(setUsers, setLoadingUsers);
  }, []);

  useEffect(() => {
    initializeGroupForm(form, groupToEdit);
  }, [groupToEdit, form]);

  return (
    <Modal
      title={groupToEdit ? "Editar Grupo" : "Nuevo Grupo"}
      open={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={groupToEdit ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleGroupSave(values, users, groupToEdit, fetchGroups, onClose, form)}
      >
        <Form.Item
          label="Nombre del Grupo"
          name="nombreGrupo"
          rules={[{ required: true, message: "El nombre del grupo es obligatorio" }]}
        >
          <Input placeholder="Ejemplo: Grupo de Desarrollo" />
        </Form.Item>

        <Form.Item
          label="Usuarios Asignados"
          name="usuarios"
          rules={[{ required: true, message: "Debe asignar al menos un usuario" }]}
        >
          <Select mode="multiple" placeholder="Selecciona los usuarios" loading={loadingUsers}>
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.username} - {user.email}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalGrupo;
