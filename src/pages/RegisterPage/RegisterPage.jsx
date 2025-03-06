import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService'; // Importar el servicio

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await registerUser(values.email, values.username, values.password);
      message.success('Registro exitoso!');

      // Redirigir al login después del registro
      navigate('/login');
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="landing-container">
      <div className="white-box">
        <h1 style={{ color: 'black' }}>¡Hola! Nos alegra que te registres</h1>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item label="Usuario" name="username" rules={[{ required: true, message: 'Ingrese su usuario!' }]}> 
            <Input placeholder="Usuario" />
          </Form.Item>
          <Form.Item label="Correo" name="email" rules={[
            { required: true, message: 'Ingrese su correo!' },
            { type: 'email', message: 'Ingrese un correo válido!' }
          ]}> 
            <Input placeholder="Correo" />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" rules={[
            { required: true, message: 'Ingrese su contraseña!' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
          ]}> 
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Registrarse</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
