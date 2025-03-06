import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import { handleTaskSave, initializeForm } from "../services/taskModalService";

const { Option } = Select;

const ModalTaskForm = ({ visible, onClose, usuario, taskToEdit, fetchTasks, groupId, groupMembers }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    initializeForm(form, taskToEdit);
  }, [taskToEdit, form]);

  return (
    <Modal 
      title={taskToEdit ? "Editar Tarea" : "Agregar Nueva Tarea"} 
      open={visible} 
      onOk={() => handleTaskSave(form, taskToEdit, usuario, fetchTasks, onClose, groupId, groupMembers)} 
      onCancel={onClose} 
      okText="Guardar" 
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Nombre de la tarea" name="titulo" rules={[{ required: true, message: "Ingrese un nombre" }]}>
          <Input placeholder="Ingresa el nombre" />
        </Form.Item>
        <Form.Item label="Descripción" name="descripcion" rules={[{ required: true, message: "Ingrese una descripción" }]}>
          <Input.TextArea placeholder="Descripción de la tarea" />
        </Form.Item>
        <Form.Item label="Fecha límite" name="fechaLimite" rules={[{ required: true, message: "Seleccione una fecha" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Estado" name="estado" rules={[{ required: true, message: "Seleccione un estado" }]}>
          <Select placeholder="Selecciona un estado">
            <Option value="Pendiente">Pendiente</Option>
            <Option value="Completado">Completado</Option>
            <Option value="Pausado">Pausado</Option>
            <Option value="Revision">Revisión</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Categoría/Tag" name="categoria" rules={[{ required: true, message: "Ingrese una categoría" }]}>
          <Input placeholder="Ejemplo: Trabajo, Personal, Estudio" />
        </Form.Item>
        {groupId && groupMembers && (
          <Form.Item label="Asignar a" name="usuarioAsignadoId" rules={[{ required: true, message: "Seleccione un miembro" }]}>
            <Select placeholder="Selecciona un miembro">
              {groupMembers.map((member) => (
                <Option key={member.id} value={member.id}>
                  {member.usuario} - {member.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ModalTaskForm;
