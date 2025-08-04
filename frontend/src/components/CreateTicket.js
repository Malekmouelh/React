import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/style.css';

function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normale');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser)._id || JSON.parse(storedUser).id : null;

    if (!userId) {
      return setMessage("Utilisateur non connecté.");
    }

    try {
      await axios.post('http://localhost:5000/api/tickets', {
        title,
        description,
        priority,
        userId
      });

      setMessage("🎉 Ticket envoyé avec succès !");
      setTitle('');
      setDescription('');
      setPriority('normale');
    } catch (err) {
      console.error("Erreur création ticket :", err);
      setMessage("❌ Erreur lors de la création du ticket.");
    }
  };

  return (
    <div className="ticket-form-container">
      <h2>Créer un ticket</h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Décris ton problème ou ta demande"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="basse">Basse</option>
          <option value="normale">Normale</option>
          <option value="élevée">Élevée</option>
        </select>

        <button type="submit">Envoyer le ticket</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

// ✅ doit être à la toute fin et hors de toute fonction
export default CreateTicket;
