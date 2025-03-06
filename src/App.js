import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/Dashboard/Dashboard';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardUsers from './pages/Dashboard/DashboardUsers';
import DashboardGrup from './pages/Dashboard/DashboardGrup';
import GroupTasksView from './pages/Dashboard/GroupTasksView';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard-usuarios" element={<DashboardUsers />} />
        <Route path="/dashboard-grupos" element={<DashboardGrup />} />
        <Route path="/grupos/:groupId/tareas" element={<GroupTasksView />} />
      </Routes>
    </Router>
  );
};

export default App;

