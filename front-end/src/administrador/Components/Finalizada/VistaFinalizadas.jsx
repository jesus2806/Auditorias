import VistaAuditorias from '../../../components/vista/VistaAuditorias';

const VistaFinalizadas = () => {

  return (
    <div>
      <div className='cont-card-repo'>
       <VistaAuditorias
          titulo="Auditorías Finalizadas"
          endpoint="/datos/espfin"
          rutaDetalle="/finalizadas"
        />
        </div>
    </div>
  );
};

export default VistaFinalizadas;