import React, { useEffect, useRef } from "react";
import BotonesRol from "../../../resources/botones-rol";
import './css/Inicio.css';
import pez from "../assets/img/Ishikawa-mini.png";
import usuario from "../assets/img/usuario.png";
import finalizado from "../assets/img/finalizado.png"
import fondo_home from "../assets/img/fondo_home.jpg"
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
      <div className="card-home" onClick={() => navigate("/auditado/vistarep")}>
        Ishikawas Asignados
        <br/><br/>
        <img src={pez} alt="pez" className='imagen-mini' />
      </div>
      <div className="card-home" onClick={() => navigate("/reportes-auditado")}>
       Auditorías Terminadas
       <br/><br/>
        <img src={finalizado} alt="finalizado" style={{width:'80%'}} className='imagen-mini' />
      </div>
      <div className="card-home" onClick={() => navigate("/auditado/informacion")}>
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