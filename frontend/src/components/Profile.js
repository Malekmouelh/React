import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/style.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const userId = userData._id || userData.id;

        if (userId) {
          axios
            .get(`http://localhost:5000/api/users/profile/${userId}`)
            .then((res) => setUser(res.data))
            .catch((err) =>
              console.error("❌ Erreur lors du chargement du profil :", err)
            );
        }
      } catch (e) {
        console.error("❌ Erreur parsing localStorage :", e);
      }
    }
  }, []);

  const handleEdit = () => {
    if (user?._id) navigate(`/edit-profile/${user._id}`);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      return setPasswordMessage("La confirmation ne correspond pas.");
    }

    axios
      .put(`http://localhost:5000/api/users/change-password/${user._id}`, {
        oldPassword,
        newPassword,
      })
      .then(() => {
        setPasswordMessage("Mot de passe mis à jour !");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Erreur lors du changement.";
        setPasswordMessage(msg);
      });
  };

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {user.photo && (
          <img
            src={`http://localhost:5000${user.photo}`}
            alt={user.username}
            className="profile-img"
          />
        )}
        <h2>{user.username}</h2>
        <p>
          <strong>Email :</strong> {user.email}
        </p>

        <button onClick={handleEdit}>Modifier le profil</button>

        <button
          className="edit-btn"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          Changer le mot de passe
        </button>
      </div>

      {showPasswordForm && (
        <div className="password-form">
          <h3>Changer le mot de passe</h3>
          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="change-password-btn" onClick={handleChangePassword}>
            Changer le mot de passe
          </button>
          {passwordMessage && (
            <p
              className="password-message"
              style={{
                color: passwordMessage.includes("mis à jour") ? "green" : "red",
              }}
            >
              {passwordMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
