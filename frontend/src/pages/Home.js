import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Bienvenue 👋</h1>
        <p className="home-subtitle">Bienvenue dans notre application moderne et sécurisée !</p>
        <div className="home-links">
          <Link to="/register" className="home-btn">S'inscrire</Link>
          <Link to="/login" className="home-btn btn-outline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
