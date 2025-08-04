import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/style.css'; // ← si le fichier est dans src/assets/css


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', formData);

    localStorage.setItem('token', res.data.token);  // <-- ajouter le token ici
    localStorage.setItem('user', JSON.stringify(res.data.user));

    setMessage("Connexion réussie !");
    navigate('/profile');
  } catch (err) {
    setMessage(err.response?.data?.message || "Erreur lors de la connexion.");
  }
};

  return (
    <div className="container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required /><br />
        <button type="submit">Se connecter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;