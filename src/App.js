import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import Clientes from './components/Clientes/Clientes';
import Saque from './components/Saque/Saque';
import Extrato from './components/Extrato/Extrato'; // 1. Importe o componente
import Perfil from './components/Perfil/Perfil'; // 1. Importe o componente

import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <main className={`content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/saque" element={<Saque />} />
          <Route path="/extrato" element={<Extrato />} /> {/* 2. Adicione a rota */}
          <Route path="/perfil" element={<Perfil />} /> {/* 2. Adicione a rota */}
        </Routes>
      </main>
    </div>
  );
}

export default App;