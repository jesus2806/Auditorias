import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../App';
import logo from "../assets/img/logoAguida.png";
import './css/Reporte.css';

const Reporte = () => {
    const { userData } = useContext(UserContext);
    const [datos, setDatos] = useState([]);
    const [hiddenDurations, setHiddenDurations] = useState([]);
    const [, setCriteriosConteo] = useState({});
    const [, setTotalCriterios] = useState(0);

    const procesarDatos = (response, userData) => {
        const datosFiltrados = response.data.filter((dato) => 
            (dato.AuditorLiderEmail === userData.Correo || 
                (dato.EquipoAuditor.length > 0 && dato.EquipoAuditor.some(auditor => auditor.Correo === userData.Correo))) &&
            (dato.Estado !== "pendiente" && dato.Estado !== "Devuelto")
        );
    
        datosFiltrados.sort((a, b) => new Date(b.FechaElaboracion) - new Date(a.FechaElaboracion));
    
        let conteo = {};
        let total = 0;
        datosFiltrados.forEach(dato => {
            dato.Programa.forEach(programa => {
                programa.Descripcion.forEach(desc => {
                    if (desc.Criterio && desc.Criterio !== 'NA') {
                        if (!conteo[desc.Criterio]) {
                            conteo[desc.Criterio] = 0;
                        }
                        conteo[desc.Criterio]++;
                        total++;
                    }
                });
            });
        });
    
        return { datosFiltrados, conteo, total };
    };
    
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/datos`);
                if (userData && userData.Correo) {
                    const { datosFiltrados, conteo, total } = procesarDatos(response, userData);
                    setDatos(datosFiltrados);
                    setCriteriosConteo(conteo);
                    setTotalCriterios(total);
                    setHiddenDurations(datosFiltrados.slice(1).map(dato => dato.Duracion));
                } else {
                    console.log('userData o userData.Correo no definidos:', userData);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        obtenerDatos();
    }, [userData]);
    

    const toggleDuration = (duration) => {
        setHiddenDurations(hiddenDurations.includes(duration) ?
            hiddenDurations.filter((dur) => dur !== duration) :
            [...hiddenDurations, duration]
        );
    };

    const checkboxValues = {
        'Conforme': 1,
        'm': 0.7,
        'M': 0.3,
        'C': 0
    };

    const calcularPuntosTotales = (conteo) => {
        let puntosTotales = 0;
        for (const [criterio, valor] of Object.entries(conteo)) {
            if (checkboxValues[criterio] !== undefined) {
                puntosTotales += valor * checkboxValues[criterio];
            }
        }
        return puntosTotales.toFixed(2);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className='escalado'>
        <div className='espacio-repo'>
            <div className="datos-container-repo">
            <h1 style={{fontSize:'3rem', display:'flex' ,justifyContent:'center', marginTop:'0'}}>Reportes Generados</h1>
                <div className="form-group-datos">
                    {datos.map((dato, periodIdx) => {
                        let conteo = {};
                        let total = 0;

                        dato.Programa.forEach(programa => {
                            programa.Descripcion.forEach(desc => {
                                if (desc.Criterio && desc.Criterio !== 'NA') {
                                    if (!conteo[desc.Criterio]) {
                                        conteo[desc.Criterio] = 0;
                                    }
                                    conteo[desc.Criterio]++;
                                    total++;
                                }
                            });
                        });

                        const puntosObtenidos = calcularPuntosTotales(conteo);

                        return (
                            <div key={periodIdx}>
                                <div className="duracion-bloque-repo">
                                    <h2 onClick={() => toggleDuration(dato.Duracion)}>
                                        Fecha de Elaboración: {formatDate(dato.FechaElaboracion)}
                                    </h2>
                                </div>

                                <div className={`update-button-container ${hiddenDurations.includes(dato.Duracion) ? 'hidden' : ''}`}>
                                    <div className='contenedor-repo'>
                                        <div className="header-container-datos-repo">
                                            <img src={logo} alt="Logo Empresa" className="logo-empresa-repo" />
                                            <h1>REPORTE DE AUDITORÍA</h1>
                                        </div>
                                        <div className='mover'>
                                            <div className="dato"><span className="bold-text">Duración de la auditoría:</span> {dato.Duracion}</div>
                                            <div className="dato"><span className="bold-text">Tipo de auditoría:</span> {dato.TipoAuditoria}</div>
                                            <div className="dato"><span className="bold-text">Fecha de elaboración de reporte:</span> {formatDate(dato.FechaElaboracion)}</div>
                                        </div>
                                        <div className='tablas-reporte'>

                                        
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colSpan="1" className="conformity-header-repo">Puntos Obtenidos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Conforme: {conteo.Conforme}</td>
                                                    <td>NC Menor: {conteo.m}</td>
                                                    <td>NC Mayor: {conteo.M}</td>
                                                    <td>NC Crítica: {conteo.C}</td>
                                                </tr>
                                                <tr>
                                                    <td>Puntuación máxima: {total}</td>
                                                    <td>Puntuación obtenida: {puntosObtenidos}</td>
                                                    <td>Porcentaje: {dato.PorcentajeTotal}%</td>
                                                    <td>Estatus: {dato.Estatus}</td>
                                                </tr>
                                                </tbody>
                                        
                                        </table>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th className="conformity-header-repo">Objetivo</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>
                                                Garantizar que el Sistema cumpla continuamente con los requisitos internacionales, 
                                                lo que da como resultado una certificación que asegura el suministro de productos 
                                                seguros a los consumidores en todo el mundo.
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th colSpan="2" className="conformity-header-repo">Alcance</th>
                                            </tr>
                                            <tr>
                                                <th className="table-header">Programas</th>
                                                <th className="table-header">Áreas auditadas</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>
                                                {dato.Programa.map((p, idx) => (
                                                    <div key={idx}>{p.Nombre}</div>
                                                ))}
                                                </td>
                                                <td>
                                                {dato.AreasAudi.map((a, idx) => (
                                                    <div key={idx}>{a}</div>
                                                ))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="table-header">Equipo auditor</th>
                                                <th className="table-header">Participantes</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                <div>Auditor líder: {dato.AuditorLider}</div>
                                                {dato.EquipoAuditor.map((e, i) => (
                                                    <div key={i}>Equipo: {e.Nombre}</div>
                                                ))}
                                                {dato.NombresObservadores && (
                                                    <div>Observador(es): {dato.NombresObservadores}</div>
                                                )}
                                                </td>
                                                <td>
                                                {dato.Auditados.map((au, i) => (
                                                    <div key={i}>{au.Nombre}</div>
                                                ))}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <div>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th colSpan="10" className="conformity-header-repo">Resultados</th>
                                                    </tr>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Programa</th>
                                                        <th>Lineamiento</th>
                                                        <th>Criterio</th>
                                                        <th>Hallazgos</th>
                                                        <th>Evidencia</th>
                                                        <th>Acciones</th>
                                                        <th>Fecha</th>
                                                        <th>Responsable</th>
                                                        <th>Efectividad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dato.Programa.map((programa, programIdx) => (
                                                        programa.Descripcion.map((desc, descIdx) => {
                                                            const firePrefix = 'https://firebasestorage';
                                                            if (desc.Criterio !== 'NA' && desc.Criterio !== 'Conforme') {
                                                                return (
                                                                    <tr key={descIdx}>
                                                                        <td>{desc.ID}</td>
                                                                        <td className='alingR2'>{programa.Nombre}</td>
                                                                        <td className='alingR'>{desc.Requisito}</td>
                                                                        <td>{desc.Criterio}</td>
                                                                        <td>{desc.Observacion}</td>
                                                                        <td className="alingR" key={descIdx}>
                                                                            {Array.isArray(desc.Hallazgo) && desc.Hallazgo.length > 0 ? (
                                                                                <div className="hallazgo-container">
                                                                                {desc.Hallazgo.map((url, idx) => {
                                                                                    const isFireImage = url.includes(firePrefix);
                                                                                    return isFireImage ? (
                                                                                    <img
                                                                                        key={idx}
                                                                                        src={url}
                                                                                        alt={`Evidencia ${idx + 1}`}
                                                                                        className="hallazgo-imagen"
                                                                                    />
                                                                                    ) : (
                                                                                    <span key={idx}>{url}</span>
                                                                                    );
                                                                                })}
                                                                                </div>
                                                                            ) : (
                                                                                <span>No hay evidencia</span>
                                                                            )}
                                                                            </td>
                                                                        <td>{}</td>
                                                                        <td>{}</td>
                                                                        <td>{}</td>
                                                                        <td>{}</td>
                                                                    </tr>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        })
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Reporte;