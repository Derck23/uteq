import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService'; // Importar servicio de autenticación

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values.username, values.password);
      message.success('Inicio de sesión exitoso!');

      if (response.data && response.data.rol) {
        // Redireccionar según el rol del usuario
        switch (response.data.rol) {
          case 'Master':
            navigate('/dashboard');
            break;
          case 'Administrador':
            navigate('/dashboard');
            break;
          case 'Work':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        throw new Error("Respuesta de inicio de sesión inválida");
      }
    } catch (error) {
      message.error(error.message || 'Usuario o contraseña incorrectos en loginPage');
    }
  };

  return (
    <div className="landing-container">
      <div className="white-box">
        <h1>Inicio de sesión</h1>
        <Form name="login" onFinish={onFinish}>
          <h2>Usuario</h2>
          <Form.Item name="username" rules={[{ required: true, message: 'Ingrese su usuario!' }]}> 
            <Input placeholder="Usuario" />
          </Form.Item>
          <h2>Contraseña</h2>
          <Form.Item name="password" rules={[{ required: true, message: 'Ingrese su contraseña!' }]}> 
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Iniciar Sesión</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;