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
          <Link to="/productos" style={{ animationDelay: "0.2s" }}><strong>Productos</strong></Link>
          <Link to="/clientes" style={{ animationDelay: "0.3s" }}><strong>Clientes</strong></Link>
          <Link to="/tareas" style={{ animationDelay: "0.4s" }}><strong>Tareas</strong></Link>
          <Link to="/publicaciones" style={{ animationDelay: "0.5s" }}><strong>Publicaciones</strong></Link>
          <Link to="/empleados" style={{ animationDelay: "0.7s" }}><strong>Empleados</strong></Link>
        </nav>
      </div>

      <div class="container-fluid">
        <div class="row">
          <div class="col-md-9">
          </div>
          <div class="col-md-3 dark_bar">
            <h1>5 Cruds</h1>
            <br />
            <h1>Juan Esmeral</h1>
            <br />
            <div class="square"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default menu