import React from 'react'
import './assets/menu/menu.css'

const menu = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu">
        <nav>
          <a href="#" style={{animationDelay: "0.2s"}}>About</a>
          <a href="#" style={{animationDelay: "0.3s"}}>Portfolio</a>
          <a href="#" style={{animationDelay: "0.4s"}}>Services</a>
          <a href="#" style={{animationDelay: "0.5s"}}>Contact</a>
          <a href="#" style={{animationDelay: "0.7s"}}>Contact</a>
        </nav>
      </div>
      <h2>JUAN ESMERAL</h2>
    </div>
  );
};

export default menu