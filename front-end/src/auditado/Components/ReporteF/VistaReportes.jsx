import './css/VistaR.css'
import VistaAuditorias from '../../../components/vista/VistaAuditorias';

const VistaReportes = () => {

  return (
    <div>
      <VistaAuditorias
        titulo="Reportes en proceso"
        endpoint="/datos/esp/aud"
        rutaDetalle="/auditado/reporte"
        procesarIshikawa={true}
      />
    </div>
  );
};

export default VistaReportes;