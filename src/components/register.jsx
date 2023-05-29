import React from 'react'
import './assets/register/register.css'
import { Link } from 'react-router-dom';

const register = () => {

  return (
    <html lang="en">
      <head>
        <title>Sagral</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,0"
        />
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        <div class="login">
          <div class="avatar">
            <img src="icon1.png" alt="" />
          </div>
          <h2>Sagral</h2>
          <h3>Bienvenidos a nuestra comunidad educativa</h3>
          <form class="login-form">
            <div class="textbox">
              <input type="email" placeholder="Usuario" />
              <span class="material-symbols-outlined"> account_circle </span>
            </div>
            <div class="textbox">
              <input type="email" placeholder="Correo" />
              <span class="material-symbols-outlined"> alternate_email </span>
            </div>
            <div class="textbox">
              <input type="password" placeholder="Contraseña" />
              <span class="material-symbols-outlined"> lock </span>
            </div>
            <div class="textbox">
              <input type="password" placeholder="Confirmar Contraseña" />
              <span class="material-symbols-outlined"> key </span>
            </div>
            <Link to="/login" type="button" className="btn btn-primary">
              <div className="boton">
                Registrarse
              </div>
            </Link>
          </form>
        </div>
      </body>
    </html>
  )
}

export default register