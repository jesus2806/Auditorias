import React from 'react';
import { Container, Box, Typography } from '@mui/material';

// Definimos la estructura del mapa del sitio como un objeto
const sitemapData = {
  name: "Audit",
  children: [
    {
      name: "inicio de sesión",
      children: [
        {
          name: "Inicio",
          children: [
            { name: "Administrador" },
            { name: "auditor" },
            { name: "Auditado" },
            { name: "Ishikawas" },
            { name: "Objetivos" }
          ]
        }
      ]
    }
  ]
};

// Función recursiva para renderizar cada nodo del árbol
const renderTree = (node) => {
  return (
    <Box 
      sx={{ 
        ml: 2, 
        borderLeft: '2px solid #ccc', 
        pl: 2, 
        mt: 1,
        '@media (max-width:600px)': { ml: 1, pl: 1 } // Ajuste responsivo
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        {node.name}
      </Typography>
      {node.children && node.children.map((child, index) => (
        <Box key={index}>
          {renderTree(child)}
        </Box>
      ))}
    </Box>
  );
};

function SiteMap() {
  return (
    <Container 
      sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '800px'
      }}
    >
      <Typography variant="h4" align="center" sx={{ mb: 3, color: '#2c3e50' }}>
        Mapa del Sitio
      </Typography>
      {renderTree(sitemapData)}
    </Container>
  );
}

export default SiteMap;
