# Dashboard Auth Application

Ce projet est une application web de gestion d'utilisateurs avec authentification, développée dans le cadre d'un stage chez **TREETRONIX Tunisie**.

##  Stack technique

- **Frontend** : React, React Router, Axios, CSS
- **Backend** : Node.js, Express, Mongoose, Multer, Bcrypt, JWT
- **Base de données** : MongoDB (locale ou cloud)
- **Autres outils** : dotenv, CORS

---

##  Lancement du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/dashboard-auth.git
cd dashboard-auth
```

### 2. Lancer le backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur : [http://localhost:5000](http://localhost:5000)

> Assurez-vous d'avoir un fichier `.env` contenant `MONGO_URI` et `JWT_SECRET`.

### 3. Lancer le frontend

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur : [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
monprojet/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── .env
└── frontend/
    ├── components/
    ├── pages/
    ├── assets/
    ├── App.js
    └── index.js
```

---

##  Fonctionnalités

- Authentification sécurisée (JWT)
- Création, modification et suppression d’utilisateurs
- Upload de photo de profil via Multer
- Changement de mot de passe
- Interface utilisateur claire et responsive
- Interaction en temps réel avec MongoDB

---

##  Variables d'environnement

Créez un fichier `.env` dans `/backend` contenant :

```env
MONGO_URI=mongodb://localhost:27017/dashboard_db
JWT_SECRET=un_token_secret
```

---

##  Licence

Projet open-source dans un cadre pédagogique. Usage libre et non commercial.

---

##  Auteur

**Mouhamed Malek Mouelhi**  
Stage réalisé chez **TREETRONIX Tunisie**
