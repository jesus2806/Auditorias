import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuSup from '../menu-sup/MenuSup';
import BackgroundCarousel from './BackgroundCarousel';
import './css/paginaInicio.css';

export const PaginaInicio = () => {
  const navigate = useNavigate();

  return (
    <div>
      <BackgroundCarousel />
    <MenuSup/>
    
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#000',
        p: 3,
      }}
    >      
      <Typography variant="h3" gutterBottom>
        Bienvenido a Audit
      </Typography>
      <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
        Optimiza tus procesos de auditoría con nuestra plataforma fácil de usar. 
        Gestiona informes, revisiones y hallazgos de manera eficiente.
      </Typography>
      <Box display="flex" gap={2}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/registro')}
        >
          Registrarte
        </Button>
        <Button 
          variant="outlined" 
          sx={{
            backgroundColor: '#000000'
          }}
          onClick={() => navigate('/login')}
        >
          Iniciar Sesion
        </Button>
      </Box>
    </Box>
    </div>
  );
};
