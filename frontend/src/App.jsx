import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import DailyEntry from './pages/DailyEntry';
import WeeklyInsights from './pages/WeeklyInsights';
import EditEntry from './pages/EditEntry';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Dashboard />} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/daily-entry" element={<DailyEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weekly-insights" element={<WeeklyInsights />} />
          <Route path="/edit-entry/:id" element={<EditEntry />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
