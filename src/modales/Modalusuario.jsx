import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { handleUserSave, initializeUserForm } from "../services/userModalService";

const { Option } = Select;

const Modalusuario = ({ visible, onClose, userToEdit, fetchUsers }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    initializeUserForm(form, userToEdit);
  }, [userToEdit, form]);

  return (
    <Modal
      title={userToEdit ? "Editar Usuario" : "Agregar Nuevo Usuario"}
      open={visible}
      onOk={() => handleUserSave(form, userToEdit, fetchUsers, onClose)}
      onCancel={onClose}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nombre de usuario"
          name="username"
          rules={[{ required: true, message: "Ingrese un nombre de usuario" }]}
        >
          <Input placeholder="Ingresa el nombre de usuario" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Ingrese un email" }]}
        >
          <Input placeholder="Ingresa el email" />
        </Form.Item>
        <Form.Item
          label="Rol"
          name="rol"
          rules={[{ required: true, message: "Seleccione un rol" }]}
        >
          <Select placeholder="Selecciona un rol">
            <Option value="Work">Work</Option>
            <Option value="Administrador">Administrador</Option>
            <Option value="Master">Master</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Modalusuario;
