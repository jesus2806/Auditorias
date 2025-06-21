import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logoAudit.png';
import './css/MenuSup.css';

function MenuSup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true si ≤600px

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = e => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          <img
            src={logo}
            alt="Logo Empresa"
            className="logo-empresa-sup"
            onClick={() => navigate('/')}
          />
        </Typography>

        {isMobile ? (
          <>
          <Button
              color="inherit"
              onClick={() => navigate('/login')}
              className="metallic-button"
            >
              ¡Vamos!
              <span></span><span></span><span></span><span></span>
            </Button>
            
            <IconButton
              color="inherit"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {['/', '/servicios', '/contacto'].map((path, i) => (
                <MenuItem
                  key={i}
                  onClick={() => { handleClose(); navigate(path); }}
                >
                  {['Inicio', 'Servicios', 'Contacto'][i]}
                </MenuItem>
              ))}
            </Menu>
            
          </>
        ) : (
          <div className="menu-buttons">
            <div className="nav-buttons">
              <Button color="inherit" onClick={() => navigate('/')}>Inicio</Button>
              <Button color="inherit" onClick={() => navigate('/servicios')}>Servicios</Button>
              <Button color="inherit" onClick={() => navigate('/contacto')}>Contacto</Button>
            </div>

            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              className="metallic-button"
            >
              ¡Vamos!
              <span></span><span></span><span></span><span></span>
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default MenuSup;