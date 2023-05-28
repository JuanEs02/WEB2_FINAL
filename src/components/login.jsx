import React from 'react'
import './assets/login/login.css'
import { Link } from 'react-router-dom';

const login = () => {
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
                    <h3>El conocimiento es poder</h3>
                    <form class="login-form">
                        <div class="textbox">
                            <input type="email" placeholder="Correo" />
                            <span class="material-symbols-outlined"> alternate_email </span>
                        </div>
                        <div class="textbox">
                            <input type="password" placeholder="Contraseña" />
                            <span class="material-symbols-outlined"> lock </span>
                        </div>
                        <button type="submit">Iniciar sesión</button>
                        <Link to="/register">Regístrate si no tienes cuenta</Link>
                    </form>
                </div>
            </body>
        </html>
    )
}

export default login