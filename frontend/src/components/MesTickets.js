import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/style.css";

function MesTickets() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      axios
        .get(`http://localhost:5000/api/tickets/user/${parsedUser.id || parsedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTickets(res.data);
        })
        .catch((err) => {
          console.error("❌ Erreur lors du chargement des tickets :", err);
        });
    }
  }, []);

  if (!user) return <p>Chargement de l'utilisateur...</p>;

  return (
    <div className="user-tickets">
      <h2>Mes Réclamations</h2>

      {tickets.length === 0 ? (
        <p>Aucune réclamation trouvée.</p>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h4>{ticket.title}</h4>
              <p>{ticket.description}</p>
              <p>
                <strong>Statut :</strong> {ticket.status} |{" "}
                <strong>Priorité :</strong> {ticket.priority}
              </p>
              <p>
                <small>Créé le : {new Date(ticket.createdAt).toLocaleString()}</small>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MesTickets;
