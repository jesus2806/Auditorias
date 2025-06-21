import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Busqueda.css'

const rutasBusqueda = [  
    // Rutas del Administrador
    { label: 'Generar Auditoría', path: '/datos' },
    { label: 'Programas', path: '/programa' },
    { label: 'Usuarios', path: '/usuarios' },
    { label: 'Ishikawa', path: '/ishikawa' },
    { label: 'Auditorías Finalizadas', path: '/vistafin' },
    { label: 'Calendario de Auditorías', path: '/auditcalendar' },
    { label: 'Departamentos', path: '/departamento' },
    { label: 'Carga de Auditorías', path: '/carga' },
    { label: 'Estadísticas', path: '/estadisticas' },
    { label: 'Revisión de Ishikawa', path: '/revish' },
    { label: 'Evaluación', path: '/evuaauditor' },
    { label: 'Ver Evaluaciones', path: '/vereva' },
    { label: 'Ishikawas Generados', path: '/ishikawasesp' },
    { label: 'Calendario de Auditorias', path: '/prog-audi' },
    { label: 'Estadísticas de Ishikawas', path: '/ishikawas-estadisticas' },
    { label: 'Revisión de Auditoría', path: '/ver-reali' },
  
    // Rutas del Auditor
    { label: 'Llenado de Checklist', path: '/pendiente' },
    { label: 'Reportes Generados', path: '/reporte' },
  
    // Rutas del Auditado
    { label: 'Diagrama Auditado', path: '/auditado/diagrama' },
    { label: 'Ishikawas Asignados', path: '/auditado/vistarep' },
    { label: 'Auditorías Terminadas', path: '/reportes-auditado' },
  
    // Rutas para Ishikawas Vacíos
    { label: 'Ishikawas Terminados', path: '/ishikawavacio' },
    { label: 'Generar Ishikawa', path: '/diagramas' }
];

function Busqueda() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  // Función que se dispara cada vez que cambia el input
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setQuery(valor);
    if (valor.trim().length > 0) {
      // Filtra las rutas que contengan el query (sin importar mayúsculas o minúsculas)
      const filtrados = rutasBusqueda.filter(ruta =>
        ruta.label.toLowerCase().includes(valor.toLowerCase())
      );
      setResultados(filtrados);
    } else {
      setResultados([]);
    }
  };

  // Función para manejar el clic sobre alguno de los resultados
  const handleResultClick = (path) => {
    // Limpia el input y los resultados al hacer clic
    setQuery('');
    setResultados([]);
    // Redirige al usuario a la ruta solicitada
    navigate(path);
  };

  return (
    <div className="busqueda-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar rutas..."
        className="busqueda-input"
      />
      {resultados.length > 0 && (
        <ul className="resultados-list">
          {resultados.map((ruta) => (
            <li
              key={ruta.path}
              onClick={() => handleResultClick(ruta.path)}
              className="resultado-item"
            >
              {ruta.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Busqueda;