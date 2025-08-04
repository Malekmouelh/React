import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const id = user?.id;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    photo: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/login'); // Redirige si pas connecté
      return;
    }

    axios.get(`http://localhost:5000/api/users/profile/${id}`)
      .then(res => {
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          photo: null
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Erreur chargement profil:', err);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/users/update/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('✅ Profil mis à jour !');
      navigate('/profile');
    } catch (err) {
      console.error('❌ Erreur MAJ :', err.response?.data || err.message);
      alert(`❌ Erreur mise à jour : ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <p>Chargement du profil...</p>;

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-card" encType="multipart/form-data">
        <h2>Modifier le profil</h2>

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default EditProfile;
