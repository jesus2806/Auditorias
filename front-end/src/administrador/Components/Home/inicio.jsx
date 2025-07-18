import Inicio from '../../../components/InicioR/InicioReusable';
import proceso from '../assets/img/proceso.png';
import revision from '../assets/img/revision.png';
import pez from '../assets/img/Ishikawa-mini.png';
import finalizado from '../assets/img/finalizado.png';
import evaluacion from '../assets/img/evaluacion.png';
import aprobado from '../assets/img/aprobado.png';
import usuarios from '../assets/img/usuarios.png';
import departamentos from '../assets/img/departamentos.png';
import verevaluacion from '../assets/img/ver-evaluacion.png';
import calendario from '../assets/img/calendario.png';
import estadisticas from '../assets/img/estadisticas.png';
import subirxls from '../assets/img/subir-xls.png';
import programas from '../assets/img/programas.png';
import fondo_home from '../assets/img/fondo_home.jpg';

const cardConfig = [
  {
    title: 'Auditorías',
    cards: [
      {
        label: 'Generar Auditoría',
        route: '/datos',
        icons: [{ src: proceso }],
      },
      {
        label: 'Revisión de Auditoría',
        route: '/ver-reali',
        icons: [{ src: revision }],
      },
      {
        label: 'Revisión de Ishikawa',
        route: '/revish',
        icons: [{ src: pez }],
      },
      {
        label: 'Auditorías Finalizadas',
        route: '/vistafin',
        icons: [{ src: finalizado, style: { width: '70%' } }],
      },
    ],
  },
  {
    title: 'Ishikawas',
    style: { marginTop: '-18%' },
    cards: [
      {
        label: 'Generar Ishikawa',
        route: '/ishikawa',
        icons: [
          { src: pez },
          { src: proceso, style: { marginTop: '-2em', width: '75%' } },
        ],
      },
      {
        label: 'Ishikawas Generados',
        route: '/ishikawasesp',
        icons: [
          { src: pez },
          { src: aprobado, style: { width: '40%', marginTop: '-1.5em' } },
        ],
      },
      {
        label: 'Estadísticas de Ishikawas',
        route: '/ishikawas-estadisticas',
        icons: [
          { src: pez },
          { src: estadisticas, style: { width: '40%', marginTop: '-1.5em' } },
        ],
      },
    ],
  },
  {
    title: 'Administración',
    style: { marginTop: '-18%' },
    cards: [
      {
        label: 'Realizar Evaluación',
        route: '/evuaauditor',
        icons: [{ src: evaluacion }],
      },
      {
        label: 'Ver Evaluaciones',
        route: '/vereva',
        icons: [{ src: verevaluacion }],
      },
      {
        label: 'Programar Auditoría',
        route: '/prog-audi',
        icons: [{ src: calendario, style: { width: '80%' } }],
      },
      {
        label: 'Calendario de Auditorías',
        route: '/auditcalendar',
        icons: [{ src: calendario, style: { width: '80%' } }],
      },
    ],
  },
  {
    title: 'Gestión',
    style: { marginTop: '-18%' },
    cards: [
      { label: 'Usuarios', route: '/usuariosRegistrados', icons: [{ src: usuarios }] },
      { label: 'Programas', route: '/programa', icons: [{ src: programas, style: { width: '75%' } }] },
      { label: 'Departamentos', route: '/departamento', icons: [{ src: departamentos, style: { width: '75%' } }] },
    ],
  },
  {
    title: 'Carga y Gráficas',
    style: { marginTop: '-18%' },
    cards: [
      { label: 'Carga de Auditorías', route: '/carga', icons: [{ src: subirxls, style: { width: '75%' } }] },
      { label: 'Estadísticas', route: '/estadisticas', icons: [{ src: estadisticas, style: { width: '75%' } }] },
    ],
  },
];

const InicioGeneral = () => (
  <Inicio fondo={fondo_home} cardConfig={cardConfig} />
);

export default InicioGeneral;
