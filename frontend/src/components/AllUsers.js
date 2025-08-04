import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/AllUsers.css';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement utilisateurs :', err);
        setError('Erreur lors du chargement des utilisateurs.');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      axios.delete(`http://localhost:5000/api/users/${id}`)
        .then(() => {
          // Mise à jour de la liste sans l'utilisateur supprimé
          setUsers(users.filter(user => user._id !== id));
        })
        .catch(err => {
          console.error('Erreur suppression utilisateur:', err);
          alert('Erreur lors de la suppression.');
        });
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">👥 Liste des Utilisateurs</h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loader">Chargement...</div>
      ) : users.length === 0 ? (
        <p className="empty-text">🚫 Aucun utilisateur trouvé.</p>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <div className="user-card" key={user._id}>
              <div className="avatar-circle">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(user._id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllUsers;
