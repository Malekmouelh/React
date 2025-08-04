const User = require('../models/user');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    if (!username || !email || !password) {
      if (req.file) fs.unlinkSync(req.file.path); 
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      photo
    });

    await user.save();

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo
      }
    });
 } catch (err) {
  if (req.file) fs.unlinkSync(req.file.path);
  console.error('Erreur complète lors de l\'inscription :', err);
  res.status(500).json({
    message: 'Erreur lors de l\'inscription',
    error: err.message,
    stack: err.stack
  });
}

};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const updateFields = {
      username,
      email
    };

    if (photo) updateFields.photo = photo;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur mis à jour', user });
  } catch (err) {
    console.error('Erreur backend updateUser :', err);
    res.status(500).json({ message: 'Erreur mise à jour', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log("📦 Utilisateurs récupérés :", users);
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Erreur getAllUsers:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};






