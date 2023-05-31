import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Menu from './components/menu';
import Productos from './components/productos';
import Clientes from './components/clientes';
import Tareas from './components/tareas';
import Publicaciones from './components/publicaciones';
import Empleados from './components/empleados';
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
        <Route path="/publicaciones" element={<Publicaciones />} /> 
        <Route path="/empleados" element={<Empleados />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);

