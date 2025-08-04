const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes); 

mongoose.connect('mongodb://localhost:27017/auth_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB:', err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
