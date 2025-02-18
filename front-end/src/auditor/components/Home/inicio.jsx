import React, { useEffect, useRef } from "react";
import './css/inicio.css';
import BotonesRol from "../../../resources/botones-rol";
import fondo_home from "../assets/img/fondo_home.jpg"
import revision from "../assets/img/revision.png";
import finalizado from "../assets/img/finalizado.png";
import usuario from "../assets/img/usuario.png";
import { useNavigate } from "react-router-dom";
import Nieve from "../../../resources/nieve";

const Inicio = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return(
    <div>
    <div className="inicio-container" style={{ position: 'relative' }}>
    <img src={fondo_home} alt="revision" className='imagen' />
      <div className="inicio-content">
        <h1>Bienvenido</h1>
      </div>
    </div>
    <Nieve/>

    <div className="fondo-home">
    <BotonesRol/>
      
    <div className="conten-funcion">
    <h1>Auditorías</h1>
    <div className="contenedor-home">
      <div className="card-home" onClick={() => navigate("/pendiente")}>
        Llenado de Checklist
        <br/><br/>
        <img src={revision} alt="revision" className='imagen-mini' />
      </div>
      <div className="card-home" onClick={() => navigate("/reporte")}>
       Reportes Generados
       <br/>
       <br/>
       <br/>
       <img src={finalizado} alt="finalizado" className='imagen-mini' style={{width:'70%'}} />
      </div>
      <div className="card-home" onClick={() => navigate("/informacion")}>
        Usuario
        <br />
        <br />
        <img src={usuario} alt="usuario" className='imagen-mini' />
      </div>
    </div>
    </div>

    </div>
    </div>
  );
};

export default Inicio;