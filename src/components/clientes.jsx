import React from 'react'
import { Link } from 'react-router-dom';

const clientes = () => {
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
          <Link to="/Productos" style={{animationDelay: "0.3s"}}><strong>Productos</strong></Link>
          <Link to="/Tareas" style={{animationDelay: "0.4s"}}><strong>Tareas</strong></Link>
          <Link to="/Publicaciones" style={{animationDelay: "0.5s"}}><strong>Publicaciones</strong></Link>
          <Link to="/Reservas" style={{animationDelay: "0.7s"}}><strong>Reservas</strong></Link>
        </nav>
      </div>
    </div>
  )
}

export default clientes