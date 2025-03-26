import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div style={{
    border: 0,
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    backgroundColor: '#333',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <div style={{
      fontSize: '6px',
      textAlign: 'center',
      width: '64em',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: '17em',
      }}>
        <h1 style={{
          fontSize: '3em',
        }}>Error 401 - No autorizado</h1>
        <p style={{
          fontSize: '1.5em',
        }}>No tienes acceso a esta página. Por favor, inicia sesión para continuar.</p>
        <img src="robot.png" alt="Robot" style={{
          width: '100px',
          height: '100px',
          marginTop: '20px',
        }} />
        <Link to="/" style={{
          fontSize: '1.2em',
          color: '#fff',
          textDecoration: 'none',
          border: '1px solid #fff',
          padding: '10px 20px',
          marginTop: '20px',
          display: 'inline-block',
        }}>Ir a Iniciar Sesión</Link>
      </div>
    </div>
  </div>
);

export default UnauthorizedPage;