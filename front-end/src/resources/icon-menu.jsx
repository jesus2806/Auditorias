import React, { useContext } from "react";
import './css/estilos.css';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../assets/img/logoAudit.png';
import Swal from "sweetalert2";
import Busqueda from "../components/busqueda/Busqueda";
import { UserContext } from '../App';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const IconMenu = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const handleLogoClick = () => {
    if(userData && userData?.TipoUsuario) {
      if(userData.TipoUsuario === 'administrador') {
        navigate('/admin');
      } else if(userData.TipoUsuario === 'auditor') {
        navigate('/auditor');
      } else {
        navigate('/auditado');
      }
    } else {
      navigate('/login');
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    // Manejamos el enfoque cuando se cierra el Popper
    if (open === false && anchorRef.current) {
      anchorRef.current.focus();
    }
  }, [open]);

  const handleLogout = () => {
  Swal.fire({
    title: '¿Está seguro de querer cerrar sesión?',
    text: '¡Tu sesión actual se cerrará!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3ccc37',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Llamada al backend para limpiar la cookie HttpOnly
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Error al hacer logout en el servidor:', err);
      }
      // Limpieza de estado de UI
      localStorage.removeItem('breadcrumbHistory');
      setUserData(null);
      setOpen(false);
      navigate('/');
    }
  });
};


  const handleNavigateToPerfil = () => {
    navigate('/informacion'); 
    setOpen(false);  
  };

  const handleNavigateToInicio = () => {
    navigate('/admin');  
    setOpen(false);  
  };

  return (
    <div className="unique-header">
  <div className="unique-header-left" onClick={handleLogoClick}>
    <img src={Logo} alt="Logo Audit" style={{ height: '50px' }} />
  </div>

  <div className="unique-header-center">
    <Busqueda />
  </div>

  <div className="unique-header-right">
    <span style={{ marginRight: '10px' }}>{userData?.Nombre}</span>
    <AccountCircleIcon
      ref={anchorRef}
      onClick={handleToggle}
      color="primary"
      sx={{ fontSize: 50 }}
      style={{ cursor: 'pointer' }}
    />

    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
                onKeyDown={handleListKeyDown}
              >
                <MenuItem onClick={handleNavigateToPerfil}>Mi Cuenta</MenuItem>
                <MenuItem onClick={handleNavigateToInicio}>Volver a Inicio</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  </div>
</div>
  );
};

export default IconMenu;