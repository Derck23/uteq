import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [rol, setRol] = useState(localStorage.getItem("rol"));

  useEffect(() => {
    const storedRol = localStorage.getItem("rol");
    console.log('Rol obtenido:', storedRol); // Verificación
    setRol(storedRol);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const menuItems = [
    ...(rol === "Master" || rol === "Administrador"
      ? [{ key: "1", label: "Grupos", onClick: () => navigate("/dashboard-grupos") }]
      : []),
    ...(rol === "Master"
      ? [{ key: "2", label: "Ver usuarios", onClick: () => navigate("/dashboard-usuarios") }]
      : []),
    { key: "4", label: "Task", onClick: () => navigate("/dashboard") },
    { key: "3", label: "Mi información" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ position: "relative" }}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
        <Button
          type="primary"
          danger
          onClick={handleLogout}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
          }}
        >
          Cerrar Sesión
        </Button>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h2>TaskApp</h2>
        </Header>
        <Content
          style={{
            margin: "16px",
            background: "#fff",
            padding: "24px",
            minHeight: "280px",
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
