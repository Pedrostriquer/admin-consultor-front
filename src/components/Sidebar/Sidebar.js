import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Home', icon: 'fa-solid fa-house', path: '/' },
    { name: 'Clientes', icon: 'fa-solid fa-users', path: '/clientes' },
    { name: 'Saque', icon: 'fa-solid fa-wallet', path: '/saque' },
    { name: 'Extrato', icon: 'fa-solid fa-receipt', path: '/extrato' },
  ];

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* SEÇÃO DO PERFIL AGORA É UM LINK */}
      <Link to="/perfil" className="profile-link">
        <div className="profile-section">
          <div className="profile-avatar">PS</div>
          {!isCollapsed && (
              <div className="profile-info">
                  <span className="profile-name">Pedro Striquer</span>
                  <span className="profile-role">Consultor</span>
              </div>
          )}
        </div>
      </Link>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link to={item.path} className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}>
              <i className={item.icon}></i>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <div className="menu-item">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            {!isCollapsed && <span>Sair</span>}
        </div>
        <div className="menu-item collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            {!isCollapsed && <span>Recolher</span>}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;