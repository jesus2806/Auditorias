import Inicio from '../../../components/InicioR/InicioReusable';
import pez from '../assets/img/Ishikawa-mini.png';
import proceso from '../assets/img/proceso.png';
import aprobado from '../assets/img/aprobado.png';
import fondo_home from '../assets/img/fondo_home.jpg';

const cardConfig = [
  {
    title: 'Ishikawas',
    cards: [
      {
        label: 'Generar Ishikawa',
        route: '/diagramas',
        icons: [
          { src: pez },
          { src: proceso, style: { marginTop: '-2em', width: '75%' } },
        ],
      },
      {
        label: 'Ishikawas Terminados',
        route: '/ishikawavacio',
        icons: [
          { src: pez },
          { src: aprobado, style: { width: '40%', marginTop: '-1.5em' } },
        ],
      },
    ],
  },
];

const InicioIshikawa = () => (
  <Inicio
    fondo={fondo_home}
    tituloBienvenida="Bienvenido"
    cardConfig={cardConfig}
  />
);

export default InicioIshikawa;
