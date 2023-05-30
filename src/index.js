import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Menu from './components/menu';
import Menu1 from './components/menu1';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/Menu1" element={<Menu1 />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);

