import React from 'react';
import { Button } from 'antd';
import  '../../App.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="white-box">
        <h1 style={{ color: 'black' }}>Bienvenido</h1>
        <Button type="primary" href="/login">Iniciar Sesión</Button>
        <Button type="primary" href="/register">Registrarse</Button>
      </div>
    </div>
  );
};

export default LandingPage;

