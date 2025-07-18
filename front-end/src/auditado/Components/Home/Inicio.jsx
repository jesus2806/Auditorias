import Inicio from '../../../components/InicioR/InicioReusable';
import pez from '../assets/img/Ishikawa-mini.png';
import finalizado from '../assets/img/finalizado.png';
import usuario from '../assets/img/usuario.png';
import fondo_home from '../assets/img/fondo_home.jpg';

const cardConfig = [
  {
    title: 'Auditorías',
    cards: [
      {
        label: 'Ishikawas Asignados',
        route: '/auditado/vistarep',
        icons: [{ src: pez }],
      },
      {
        label: 'Auditorías Terminadas',
        route: '/reportes-auditado',
        icons: [{ src: finalizado, style: { width: '80%' } }],
      },
      {
        label: 'Usuario',
        route: '/auditado/informacion',
        icons: [{ src: usuario }],
      },
    ],
  },
];

const InicioAuditado = () => (
  <Inicio
    fondo={fondo_home}
    tituloBienvenida="Bienvenido"
    cardConfig={cardConfig}
  />
);

export default InicioAuditado;
