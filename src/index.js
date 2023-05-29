import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './components/login';
import Register from './components/register';
import Menu from './components/menu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

