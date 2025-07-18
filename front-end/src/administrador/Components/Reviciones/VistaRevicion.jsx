import VistaAuditorias from '../../../components/vista/VistaAuditorias';

const VistaRevicion = () => {

  return (
    <div>
      <VistaAuditorias
      titulo="Auditorías en Revisión"
      endpoint="/datos/espreal"
      rutaDetalle="/revicion"
    />
    </div>
  );
};

export default VistaRevicion;