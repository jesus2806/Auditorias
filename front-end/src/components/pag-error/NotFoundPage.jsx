import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{
    color: '#fff',
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
  }}>
    <div style={{
      textAlign: 'center',
      position: 'relative',
      width: '80%',
      margin: '100px auto'
    }}>
      <div style={{
        fontSize: '220px',
        letterSpacing: '15px',
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block'
      }}>404</div>
      <div style={{
        fontSize: '4em',
        letterSpacing: '12px',
        lineHeight: '80%',
        marginTop: '20px'
      }}></div>
      <div style={{ fontSize: '20px', marginTop: '10px' }}>Oops!! La pagina no se encontro</div>
      <hr style={{
        width: '420px',
        height: '10px',
        border: 'none',
        borderTop: '5px solid #fff',
        margin: '20px auto'
      }} />
      <Link to="/" style={{
        backgroundColor: 'white',
        color: '#33cc99',
        textDecoration: 'none',
        padding: '12px 24px',
        fontSize: '1.2rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.2)'
      }}>Ir a un sitio seguro</Link>
    </div>

    {/* Nubes más grandes y más cantidad */}
    <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.9, fontSize: '150px', animation: 'moveclouds 20s linear infinite' }}>
      ☁️
    </div>
    <div style={{ position: 'absolute', top: '30%', right: '10%', opacity: 0.7, fontSize: '120px', animation: 'moveclouds 18s linear infinite' }}>
      ☁️
    </div>
    <div style={{ position: 'absolute', top: '50%', left: '20%', opacity: 0.6, fontSize: '180px', animation: 'moveclouds 22s linear infinite' }}>
      ☁️
    </div>
    <div style={{ position: 'absolute', bottom: '10%', right: '15%', opacity: 0.8, fontSize: '200px', animation: 'moveclouds 25s linear infinite' }}>
      ☁️
    </div>

    <style>
      {`
        @keyframes moveclouds {
          0% { transform: translateX(1000px); }
          100% { transform: translateX(-1000px); }
        }
      `}
    </style>
  </div>
);

export default NotFoundPage;