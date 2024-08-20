// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Assurez-vous d'ajouter des styles si nécessaire

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Tous droits réservés. Conçu par <a href="https://williamlowe.com" target="_blank" rel="noopener noreferrer">Lowe William</a></p>
    </footer>
  );
};

export default Footer;
