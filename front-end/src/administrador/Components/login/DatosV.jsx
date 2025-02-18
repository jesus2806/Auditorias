import React from 'react';
import './css/datosv.css'; // Archivo CSS importado para los estilos

const DatosV = () => {

  return (
    <div className="modal-body">
        <h1>Versión 1.1 (Beta)</h1>
      <ul>
        <h3 className="modal-title">Cambio de diseño en Inicio</h3>
        <li>Se cambió el diseño de la pantalla de inicio con el propósito de facilitar al usuario la ubicación de los elementos.</li>
      </ul>

      <ul>
        <h3 className="modal-title">Cambios en la paleta de colores</h3>
        <li>Se ajustaron los tonos en la paleta de colores para ser mas agradables a la vista.</li>
      </ul>

      <ul>
        <h3 className="modal-title">Actualización de contraseñas</h3>
        <li>Se agrego la posibilidad de cambiar la contraseña de los usuarios por parte del administrador.</li>
      </ul>

      <ul>
        <h3 className="modal-title">Cloud Storage </h3>
        <li>Se realizo la migración de imágenes a Cloud Storage por parte de Firebase, mejorando el rendimiento para la carga de diagramas.</li>
      </ul>

      <ul>
        <h3 className="modal-title">Calendario</h3>
        <li>Se soluciono el problema en calendarios que ocasionaba el no poder visualizar las auditorias</li>
      </ul>
    </div>
  );
};

export default DatosV;
