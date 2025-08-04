import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userData ? JSON.parse(userData) : null;
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.email === 'admin@root.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className="sidebar-logo">
        {isOpen && <Link to="/">🏠 Home</Link>}
      </div>

      <nav className="sidebar-links">
        {!isLoggedIn ? (
          <>
            <Link to="/register">{isOpen ? "S'inscrire" : '📝'}</Link>
            <Link to="/login">{isOpen ? 'Se connecter' : '🔑'}</Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin">{isOpen ? 'Liste des utilisateurs' : '👥'}</Link>
                <Link to="/admin/tickets">{isOpen ? 'Liste des Réclamations' : '📄'}</Link>
              </>
            ) : (
              <>
                <Link to="/ticket/new">{isOpen ? 'Créer une réclamation' : '➕'}</Link>
                <Link to="/mes-tickets">{isOpen ? 'Mes réclamations' : '📁'}</Link>
              </>
            )}
            <Link to="/profile">{isOpen ? 'Profil' : '👤'}</Link>
            <button onClick={handleLogout} className="logout-btn">
              {isOpen ? 'Déconnexion' : '🚪'}
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
