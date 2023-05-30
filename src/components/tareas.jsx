import React from 'react'
import { Link } from 'react-router-dom';

const Tareas = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu closed">
        <nav>
          <h2>Menu de CRUDs</h2>
          <Link to="/" style={{animationDelay: "0.2s"}}><strong>Regresar</strong></Link>
          <br/>
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{animationDelay: "0.3s"}}><strong>Productos</strong></Link>
          <Link to="/clientes" style={{animationDelay: "0.4s"}}><strong>Clientes</strong></Link>
          <Link to="/publicaciones" style={{animationDelay: "0.5s"}}><strong>Publicaciones</strong></Link>
          <Link to="/peservas" style={{animationDelay: "0.7s"}}><strong>Reservas</strong></Link>
        </nav>
      </div>
    </div>
  )
}

export default Tareas   