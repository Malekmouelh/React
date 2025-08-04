// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import AllUsers from './components/AllUsers';
import PrivateRoute from './components/PrivateRoute';
import CreateTicket from './components/CreateTicket';
import AdminTicketList from './components/AdminTicketList';
import MesTickets from './components/MesTickets';
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import './assets/css/style.css';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <Router>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        style={{
          marginLeft: isSidebarOpen ? '240px' : '60px',
          transition: 'margin 0.3s ease',
          padding: '20px',
        }}
      >
  <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile/:id"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AllUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/ticket/new"
          element={
            <PrivateRoute>
              <CreateTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <PrivateRoute>
              <AdminTicketList />
            </PrivateRoute>
          }
        />
        <Route
          path="/mes-tickets"
          element={
            <PrivateRoute>
              <MesTickets />
            </PrivateRoute>
          }
        />
      </Routes>
      
      </div>
    </Router>
  );
}

export default App;
