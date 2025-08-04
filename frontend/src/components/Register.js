import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/style.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    photo: null
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setMessage('Envoi en cours...');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email.toLowerCase().trim());
      data.append('password', formData.password);
      if (formData.photo) data.append('photo', formData.photo);

      const response = await axios.post('http://localhost:5000/api/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(response.data.message || 'Inscription réussie !');
      setFormData({ username: '', email: '', password: '', photo: null });
    } catch (err) {
      setIsError(true);
      console.error('Erreur inscription:', err.response);
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erreur lors de l\'inscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Photo de profil (optionnel)</label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" aria-label="Chargement en cours"></span> Chargement...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;
