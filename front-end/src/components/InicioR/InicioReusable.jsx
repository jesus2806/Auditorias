// src/components/InicioReusable.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesRol from '../../resources/botones-rol';
import Nieve from '../../resources/nieve';
import './css/inicio.css'; 

/**
 * cardConfig: Array of sections with structure:
 * [
 *   {
 *     title: string,
 *     cards: [
 *       {
 *         label: string,
 *         route: string,
 *         icons: [ { src: string, style?: object } ],
 *       }
 *     ]
 *   }
 * ]
 */
const Inicio = ({ fondo, tituloBienvenida = 'Bienvenido', cardConfig = [] }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOverlayClick = (e) => e.target.classList.contains('modal-overlay') && handleCloseModal();

  return (
    <div>
      <div className="inicio-container" style={{ position: 'relative' }}>
        <img src={fondo} alt="fondo" className='imagen' />
        <div className="inicio-content"><h1>{tituloBienvenida}</h1></div>
      </div>
      <Nieve />
      <div className="fondo-home">
        <BotonesRol />
        {cardConfig.map((section) => (
          <div key={section.title} className="conten-funcion" style={section.style}>
            <h1>{section.title}</h1>
            <div className="contenedor-home">
              {section.cards.map((card) => (
                <div
                  key={card.label}
                  className="card-home"
                  onClick={() => navigate(card.route)}
                >
                  <span>{card.label}</span>
                  {card.icons.map((icon, i) => (
                    <img
                      key={i}
                      src={icon.src}
                      alt={card.label}
                      className="imagen-mini"
                      style={icon.style}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
          <span
            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
            onClick={handleOpenModal}
          >
            v2.1.4(Beta)
          </span>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div onClick={(e) => e.stopPropagation()}>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;