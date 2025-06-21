import React, {useRef, useState, useEffect} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import IconMenu from '../../resources/icon-menu';
import './Pie.css';

// Datos del sitemap
const sitemapData = {
  name: 'Home',
  link:'/',
  children: [
    {
      name: 'inicio de sesión',
      link: '/login',
      children: [
        {
          name: 'Inicio',
          link:'/admin',
              children: [
                {
                  name: 'Auditorías',
                  children: [
                    { name: 'Generar Auditoría',link:'/datos' },
                    { name: 'Revisión de Auditoría',link:'/ver-reali' },
                    { name: 'Revisión de Ishikawa',link:'/revish' },
                    { name: 'Auditorías Finalizadas',link:'/vistafin'},
                  ],
                },
                { name: 'Ishikawa', children: [{ name: 'Ishikawas Generados',link:'/ishikawasesp' }] },
                {
                  name: 'Administración',
                  children: [
                    { name: 'Realizar Evaluación',link:'/evuaauditor' },
                    { name: 'Ver Evaluaciones',link:'/vereva' },
                    { name: 'Calendario de Auditorías',link:'/auditcalendar' },
                  ],
                },
                {
                  name: 'Gestion',
                  children: [
                    { name: 'Usuarios',link:'/usuariosRegistrados' },
                    { name: 'Programas',link:'/programa' },
                    { name: 'Departamento',link:'/departamento' },
                  ],
                },
                {
                  name: 'Carga y Graficas',
                  children: [
                    { name: 'Carga de Auditorías',link:'/carga' },
                    { name: 'Estadísticas',link:'/estadisticas' },
                  ],
                },
              ],
            },
           
          ],
        },
      ],
};

const SitemapTree = ({ node }) => (
  <TreeNode
    label={
      <div className="card">
        {node.link ? (
          <a href={node.link}>{node.name}</a>
        ) : (
          node.name
        )}
      </div>
    }
  >
    {node.children?.map((child, i) => (
      <SitemapTree key={i} node={child} />
    ))}
  </TreeNode>
);

export default function SiteMap() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [scale, setScale] = useState(1);

  const calculateScale = () => {
    const container = containerRef.current;
    const chart = chartRef.current;
    if (container && chart) {
      const cW = container.offsetWidth;
      const chW = chart.offsetWidth;
      const newScale = cW / chW;
      setScale(newScale < 1 ? newScale : 1);
    }
  };

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <>
    <IconMenu/>
    <div className="sitemap-container">
      <h1 className="sitemap-title">Mapa Conceptual del Sitio</h1>
      <div className="scroll-container" ref={containerRef}>
        <div
          className="chart-wrapper"
          ref={chartRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <Tree lineWidth="2px" lineColor="#ccc" lineBorderRadius="4px">
            <SitemapTree node={sitemapData} />
          </Tree>
        </div>
      </div>
    </div>
    </>
  );
}