import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logoAudit.png';
import './css/MenuSup.css';

function MenuSup() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <div>
            <img src={logo} alt="Logo Empresa" className="logo-empresa-sup" />
          </div>
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Inicio</Button>
        <Button color="inherit" onClick={() => navigate('/servicios')}>Servicios</Button>
        <Button color="inherit" onClick={() => navigate('/contacto')}>Contacto</Button>
      </Toolbar>
    </AppBar>
  );
}

export default MenuSup;
