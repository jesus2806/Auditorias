import React from 'react';
import MenuSup from '../menu-sup/MenuSup';

const serviciosList = [
  {
    id: 1,
    nombre: "Creación de Asesorías",
    descripcion: "Inicia tus asesorías de forma rápida y personalizada. Configura parámetros, establece objetivos y define estrategias para cada cliente.",
    beneficios: [
      "Fácil configuración",
      "Personalización completa",
      "Ahorro de tiempo en la gestión"
    ]
  },
  {
    id: 2,
    nombre: "Revisión y Seguimiento",
    descripcion: "Mantén el control de cada sesión con herramientas de seguimiento que te permiten evaluar el progreso y ajustar estrategias en tiempo real.",
    beneficios: [
      "Monitoreo continuo",
      "Alertas y recordatorios",
      "Informes detallados"
    ]
  },
  {
    id: 3,
    nombre: "Finalización y Evaluación",
    descripcion: "Cierra el ciclo de asesoría con evaluaciones detalladas y reportes que te ayudarán a mejorar continuamente tu servicio.",
    beneficios: [
      "Cierre eficiente de proyectos",
      "Feedback constructivo",
      "Reportes de resultados"
    ]
  }
];

function Servicios() {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '2.5em',
    color: '#2c3e50'
  };

  const subtitleStyle = {
    fontSize: '1.2em',
    color: '#34495e'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '30px'
  };

  const cardTitleStyle = {
    color: '#2980b9'
  };

  const beneficiosTitleStyle = {
    color: '#16a085',
    marginTop: '10px'
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const btnStyle = {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    marginTop: '10px'
  };

  return (
    <div>
         <MenuSup/>
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Descubre Nuestra Gestión de Asesorías</h1>
        <p style={subtitleStyle}>
          Una solución integral diseñada para ayudarte a gestionar tus asesorías desde el inicio hasta la finalización.
        </p>
      </header>

      {serviciosList.map(servicio => (
        <div key={servicio.id} style={cardStyle}>
          <h2 style={cardTitleStyle}>{servicio.nombre}</h2>
          <p>{servicio.descripcion}</p>
          <h4 style={beneficiosTitleStyle}>Beneficios:</h4>
          <ul>
            {servicio.beneficios.map((beneficio, index) => (
              <li key={index}>{beneficio}</li>
            ))}
          </ul>
        </div>
      ))}

      <footer style={footerStyle}>
        <p style={{ fontSize: '1.1em', color: '#7f8c8d' }}>
          ¡Empieza hoy y transforma la forma en que gestionas tus asesorías! Explora, configura y crece con nuestras herramientas.
        </p>
        <button style={btnStyle}>Conoce Más</button>
      </footer>
    </div>
    </div>
  );
}

export default Servicios;