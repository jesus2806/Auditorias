import React, { useEffect, useRef } from "react";
import BotonesRol from "../../../resources/botones-rol";
import './css/Inicio.css';
import fondo_home from "../assets/img/fondo_home.jpg"
import menu from "../assets/img/menu.png";
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
    <h1>Objetivos</h1>
    <div className="contenedor-home">
      <div className="card-home" onClick={() => navigate("/menu")}>
        Menú
        <br/><br/>
        <img src={menu} alt="menu" className='imagen-mini' />
      </div>
      <div className="card-home" onClick={()=> navigate("/concentradon")}>
       Concentrado
       <br/><br/>
       <p>...</p>
        
      </div>
      <div className="card-home" onClick={()=> navigate("/saefty-goals2")}>
      Safety Goals
        <br />
        <br />
       <p>...</p>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default Inicio;