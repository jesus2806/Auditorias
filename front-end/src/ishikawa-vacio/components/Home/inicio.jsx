import React, { useEffect, useRef } from "react";
import './css/inicio.css';
import BotonesRol from "../../../resources/botones-rol";
import proceso from "../assets/img/proceso.png";
import pez from "../assets/img/Ishikawa-mini.png";
import aprobado from "../assets/img/aprobado.png";
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
    <h1>Ishikawas</h1>
    <div className="contenedor-home">
      <div className="card-home" onClick={() => navigate("/diagramas")}>
        Generar Ishikawa
        <br/><br/>
        <img src={pez} alt="pez" className='imagen-mini' />
        <img src={proceso} alt="proceso" className='imagen-mini' style={{marginTop:'-2em', width:'75%'}}/>
      </div>
      <div className="card-home" onClick={() => navigate("/ishikawavacio")}>
       Ishikawas Terminados
      <img src={pez} alt="pez" className='imagen-mini' />
      <img src={aprobado} alt="aprobado" className='imagen-mini' style={{width: '40%',marginTop:'-1.5em'}}/>
      </div>
    </div>
    </div>

    </div>
    </div>
  );
};

export default Inicio;