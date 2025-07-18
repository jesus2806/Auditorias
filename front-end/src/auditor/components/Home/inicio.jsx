import Inicio from '../../../components/InicioR/InicioReusable';
import revision from '../assets/img/revision.png';
import finalizado from '../assets/img/finalizado.png';
import usuario from '../assets/img/usuario.png';
import fondo_home from '../assets/img/fondo_home.jpg';

const cardConfig = [
  {
    title: 'Auditorías',
    cards: [
      {
        label: 'Llenado de Checklist',
        route: '/pendiente',
        icons: [{ src: revision }],
      },
      {
        label: 'Reportes Generados',
        route: '/reporte',
        icons: [{ src: finalizado, style: { width: '70%' } }],
      },
      {
        label: 'Usuario',
        route: '/informacion',
        icons: [{ src: usuario }],
      },
    ],
  },
];

const InicioOperativo = () => (
  <Inicio
    fondo={fondo_home}
    tituloBienvenida="Bienvenido"
    cardConfig={cardConfig}
  />
);

export default InicioOperativo;
