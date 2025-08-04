import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "./ConfirmModal"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../assets/css/AdminTicketList.css";

function AdminTicketList() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); 

 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const filtered =
      filter === "all"
        ? tickets
        : tickets.filter((ticket) =>
            filter === "résolu"
              ? ticket.status === "résolu"
              : ticket.status !== "résolu"
          );
    setFilteredTickets(filtered);
  }, [tickets, filter]);

  const fetchTickets = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || user.email !== "admin@root.com") {
      setMessage("⛔ Accès refusé. Réservé à l'admin.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/tickets")
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement tickets :", err);
        setMessage("❌ Erreur lors de la récupération des tickets.");
        setLoading(false);
      });
  };

  const markAsResolved = (id) => {
    axios
      .put(`http://localhost:5000/api/tickets/${id}`, { status: "résolu" })
      .then(() => {
        setTickets(
          tickets.map((ticket) =>
            ticket._id === id ? { ...ticket, status: "résolu" } : ticket
          )
        );
      })
      .catch((err) => {
        console.error("Erreur mise à jour statut :", err);
        alert("Erreur lors de la mise à jour du statut.");
      });
  };

  const openDeleteModal = (ticketId) => {
    setTicketToDelete(ticketId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!ticketToDelete) return;

    axios
      .delete(`http://localhost:5000/api/tickets/${ticketToDelete}`)
      .then(() => {
        setTickets(tickets.filter((ticket) => ticket._id !== ticketToDelete));
        setIsModalOpen(false);
        setTicketToDelete(null);
      })
      .catch((err) => {
        console.error("Erreur suppression ticket :", err);
        alert("Erreur lors de la suppression du ticket.");
        setIsModalOpen(false);
        setTicketToDelete(null);
      });
  };

  // Annule la suppression
  const cancelDelete = () => {
    setIsModalOpen(false);
    setTicketToDelete(null);
  };

  const resolvedCount = tickets.filter((t) => t.status === "résolu").length;
  const openCount = tickets.filter((t) => t.status !== "résolu").length;

  // Calcul de la moyenne des tickets résolus (en %)
  const resolvedPercentage =
    tickets.length === 0
      ? 0
      : Math.round((resolvedCount / tickets.length) * 100);

  // Données pour le graphique
  const chartData = [
    { name: "Ouverts", value: openCount, fill: "#e74c3c" },
    { name: "Résolus", value: resolvedCount, fill: "#27ae60" },
    { name: "Total", value: tickets.length, fill: "#2980b9" },
  ];

  if (loading) return <p className="loader">Chargement...</p>;
  if (message) return <p className="error">{message}</p>;

  return (
    <>
      <div className="tickets-container">
        <h2 className="tickets-title">🎫 Liste des Réclamations</h2>

        {/* Moyenne résolus */}
        <div
          className="resolved-average"
          style={{ fontSize: "1.4rem", fontWeight: "bold", marginBottom: 20 }}
        >
          Moyenne des tickets résolus : {resolvedPercentage}%
        </div>

        <div style={{ width: "100%", height: 300, marginBottom: 30 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={({ index }) => chartData[index].fill}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filtres */}
        <div className="filters">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            📋 Tous
          </button>
          <button
            onClick={() => setFilter("résolu")}
            className={filter === "résolu" ? "active" : ""}
          >
            ✅ Résolus
          </button>
          <button
            onClick={() => setFilter("ouvert")}
            className={filter === "ouvert" ? "active" : ""}
          >
            🕒 Ouverts
          </button>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="empty-text">🚫 Aucune Réclamation trouvée.</p>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div className="ticket-card" key={ticket._id}>
                <h3>{ticket.title}</h3>
                <p>
                  <strong>Description :</strong> {ticket.description}
                </p>
                <p>
                  <strong>Statut :</strong> {ticket.status}
                </p>
                <p>
                  <strong>Priorité :</strong> {ticket.priority}
                </p>
                <p>
                  <strong>Utilisateur :</strong> {ticket.user?.username} (
                  {ticket.user?.email})
                </p>
                <p>
                  <strong>Créé le :</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>

                <div className="ticket-actions">
                  {ticket.status !== "résolu" && (
                    <button
                      className="resolve-btn"
                      onClick={() => markAsResolved(ticket._id)}
                    >
                      ✅ Résolu
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => openDeleteModal(ticket._id)}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale confirmation */}
      <ConfirmModal
        isOpen={isModalOpen}
        message="Voulez-vous vraiment supprimer ce ticket ?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}

export default AdminTicketList;