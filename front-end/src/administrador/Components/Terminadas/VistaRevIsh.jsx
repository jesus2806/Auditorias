import './css/RevIsh.css'
import VistaAuditorias from '../../../components/vista/VistaAuditorias';

const RevIshi = () => { 

  return (
    <div>
       <VistaAuditorias
          titulo="Revisión de Ishikawa"
          endpoint="/datos/esp"
          rutaDetalle="/terminada"
        />
    </div>
  );
};

export default RevIshi;