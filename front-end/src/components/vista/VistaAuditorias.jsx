// src/components/VistaAuditorias.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from '../../api';
import logo from '../../administrador/Components/assets/img/logoAguida-min.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  return nuevaFecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getDateLabel = (fecha) => {
  const recordDate = new Date(fecha);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  recordDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays === 2) return "Hace 2 días";
  if (diffDays >= 3 && diffDays < 7) return "Esta semana";

  if (
    recordDate.getMonth() === today.getMonth() &&
    recordDate.getFullYear() === today.getFullYear()
  ) {
    return "Este mes";
  }

  const options = { month: 'long' };
  if (recordDate.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }
  return recordDate.toLocaleDateString('es-ES', options);
};

const VistaAuditorias = ({ titulo, endpoint, rutaDetalle, agruparPorFecha = true, conUsuario = false, procesarIshikawa = false }) => {
  const { userData } = useContext(UserContext);
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (procesarIshikawa) {
          const encodedNombre = encodeURIComponent(userData.Nombre);
          const responseIshikawa = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/ishikawa/por/vista/${encodedNombre}`);
          const respIsh = Array.isArray(responseIshikawa.data) ? responseIshikawa.data : [responseIshikawa.data];

          const idRepConsultados = new Set();
          const promises = respIsh.map(async (ishikawa) => {
            const idRep = ishikawa?.idRep;
            if (!idRep || idRepConsultados.has(idRep)) return null;
            idRepConsultados.add(idRep);

            try {
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
                params: { idRep },
              });
              return response.data;
            } catch (error) {
              console.error(`Error al obtener datos para idRep ${idRep}:`, error);
              return null;
            }
          });

          const allDatos = await Promise.all(promises);
          const filteredDatos = allDatos.filter(dato => dato !== null).flat();
          setDatos(filteredDatos);
        } else {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`);
          setDatos(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDatos();
  }, [userData, endpoint, procesarIshikawa]);

  const navReporte = (_id) => navigate(`${rutaDetalle}/${_id}`);

  const datosOrdenados = datos.slice().reverse();

  return (
    <div>
      <div className='cont-card-repo'>
        <h1>{titulo}</h1>
      </div>
      {datos.length > 0 ? (
        <div className='cont-card-repo'>
          {datosOrdenados.map((dato, index) => {
            const currentLabel = getDateLabel(dato.FechaElaboracion);
            let showDivider = false;
            if (index === 0 || getDateLabel(datosOrdenados[index - 1].FechaElaboracion) !== currentLabel) {
              showDivider = agruparPorFecha;
            }
            return (
              <React.Fragment key={dato._id}>
                {showDivider && <div className="divider" data-label={currentLabel}></div>}
                <div className='card-repo' onClick={() => navReporte(dato._id)} style={{ cursor: 'pointer' }}>
                  <img src={logo} alt="Logo Empresa" className="logo-empresa-revi" />
                  <p>Fecha Elaboración: {formatearFecha(dato.FechaElaboracion)}</p>
                  <p>Tipo Auditoria: {dato.TipoAuditoria}</p>
                  <p>Duración: {dato.Duracion}</p>
                  {dato.Cliente && <p>Cliente: {dato.Cliente}</p>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <h2 className='cont-card-repo'>No hay resultados para mostrar.</h2>
      )}
    </div>
  );
};

export default VistaAuditorias;
