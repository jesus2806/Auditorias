import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from '../../assets/img/logoAudit.png';
import './css/MenuSup.css'

function MenuSup() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <div>
            <img src={logo} alt="Logo Empresa" className="logo-empresa-sup" />
          </div>
        </Typography>
        <Button color="inherit">Inicio</Button>
        <Button color="inherit">Servicios</Button>
        <Button color="inherit">Contacto</Button>
      </Toolbar>
    </AppBar>
  );
}

export default MenuSup;
