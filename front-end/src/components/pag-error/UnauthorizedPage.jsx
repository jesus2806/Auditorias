import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div style={{
    border: 0,
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'relative', // Para que los íconos floten correctamente
  }}>
    {/* Íconos flotantes con efecto de explosión */}
    <div style={{
      fontSize: '6em',
      color: '#f39c12',
      position: 'absolute',
      top: '10%',
      left: '5%',
      animation: 'floatAndExplode 5s ease-in-out infinite',
    }}>
      ⚠️
    </div>
    <div style={{
      fontSize: '6em',
      color: '#f39c12',
      position: 'absolute',
      top: '30%',
      right: '10%',
      animation: 'floatAndExplode 7s ease-in-out infinite',
    }}>
      ⚠️
    </div>
    <div style={{
      fontSize: '6em',
      color: '#f39c12',
      position: 'absolute',
      top: '50%',
      left: '20%',
      animation: 'floatAndExplode 6s ease-in-out infinite',
    }}>
      ⚠️
    </div>
    <div style={{
      fontSize: '6em',
      color: '#f39c12',
      position: 'absolute',
      bottom: '10%',
      right: '15%',
      animation: 'floatAndExplode 8s ease-in-out infinite',
    }}>
      ⚠️
    </div>

    <div style={{
      fontSize: '18px',
      textAlign: 'center',
      width: '80%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: '4em',
          marginTop: '10px',
        }}>Error 401 - No autorizado</h1>
        <p style={{
          fontSize: '2em',
        }}>No tienes acceso a esta página. Por favor, inicia sesión para continuar.</p>
        <Link to="/" style={{
          fontSize: '1.5em',
          color: '#fff',
          textDecoration: 'none',
          border: '1px solid #fff',
          padding: '15px 30px',
          marginTop: '30px',
          display: 'inline-block',
          borderRadius: '5px',
          backgroundColor: '#3498db',
          transition: 'background-color 0.3s',
        }}>
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>

    <style>
      {`
        @keyframes floatAndExplode {
          0% {
            transform: translate(0, 0);
            opacity: 1;
            font-size: 6em;
          }
          50% {
            transform: translate(100px, -100px);
            font-size: 8em;
            opacity: 0.7;
          }
          100% {
            transform: translate(-200px, -200px);
            font-size: 10em;
            opacity: 0;
          }
        }
      `}
    </style>
  </div>
);

export default UnauthorizedPage;
