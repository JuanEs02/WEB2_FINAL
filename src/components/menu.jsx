import React from 'react'
import './assets/menu/menu.css'
import { Link } from 'react-router-dom';

const menu = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu">
        <nav>
          <h2>Menu de CRUDS</h2>
          <Link to="/productos" style={{animationDelay: "0.2s"}}><strong>Productos</strong></Link>
          <Link to="/clientes" style={{animationDelay: "0.3s"}}><strong>Clientes</strong></Link>
          <Link to="/tareas" style={{animationDelay: "0.4s"}}><strong>Tareas</strong></Link>
          <Link to="/publicaciones" style={{animationDelay: "0.5s"}}><strong>Publicaciones</strong></Link>
          <Link to="/reservas" style={{animationDelay: "0.7s"}}><strong>Reservas</strong></Link>
        </nav>
      </div>
      <h2>JUAN ESMERAL</h2>
    </div>
  );
};

export default menu