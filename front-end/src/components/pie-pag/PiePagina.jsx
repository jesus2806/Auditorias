import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import './Pie.css';

const PiePagina = () => {
  return (
    <footer className="content-pie">
      <div className="container">
        <p className="text-sm">&copy; {new Date().getFullYear()} Audit. Todos los derechos reservados.</p>

        <div className="flex justify-center gap-4 mt-3">
          <a href="https://www.facebook.com/profile.php?id=61573105030565" target="_blank" rel="noopener noreferrer">
            <Facebook className="w-5 h-5 hover:text-blue-500 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-5 h-5 hover:text-blue-400 transition" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-5 h-5 hover:text-pink-500 transition" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;
