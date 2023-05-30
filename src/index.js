import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Menu from './components/menu';
import Productos from './components/productos';
import Clientes from './components/clientes';
import Tareas from './components/tareas';
import Publicaciones from './components/publicaciones';
import Reservas from './components/reservas';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/productos" element={<Productos />} /> 
        <Route path="/clientes" element={<Clientes />} /> 
        <Route path="/tareas" element={<Tareas />} /> 
        <Route path="/Publicaciones" element={<Publicaciones />} /> 
        <Route path="/Reservas" element={<Reservas />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);

