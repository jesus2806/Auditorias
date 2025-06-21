import React, { useState, useEffect } from 'react';
import './css/ScrollButton.css';

function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Función para activar o desactivar la visibilidad del botón según el scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Umbral de 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función que desplaza suavemente la ventana al tope
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-button" aria-label="Subir">
          {/* Puedes utilizar un icono de flecha. Ejemplo con un caracter de HTML */}
          &#8593;
        </button>
      )}
    </div>
  );
}

export default ScrollTopButton;