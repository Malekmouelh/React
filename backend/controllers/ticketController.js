const Ticket = require('../models/Ticket');

// ✅ Créer un ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const ticket = new Ticket({ title, description, priority, user: userId });
    await ticket.save();

    res.status(201).json({ message: "Ticket créé", ticket });
  } catch (err) {
    res.status(500).json({ message: "Erreur création ticket", error: err.message });
  }
};

// ✅ Obtenir tous les tickets (admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('user', 'username email');
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération tickets", error: err.message });
  }
};

// ✅ Obtenir les tickets d’un utilisateur
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.params.userId });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération tickets utilisateur", error: err.message });
  }
};

// ✅ Mettre à jour un ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket non trouvé" });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour", error: err.message });
  }
};

// ✅ Supprimer un ticket
exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ticket supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression ticket", error: err.message });
  }
};
