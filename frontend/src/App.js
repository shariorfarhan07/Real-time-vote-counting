import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import VotingPage from './components/VotingPage';
import AdminPage from './components/AdminPage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/farhan';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/farhan" element={<AdminPage />} />
      </Routes>
      {isAdminPage && (
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Voting View</Link>
          <Link to="/farhan" className="nav-link">Admin Control</Link>
        </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

