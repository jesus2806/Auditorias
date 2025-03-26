import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import MenuSup from '../menu-sup/MenuSup';

function Contacto() {
  return (
    <div>
    <MenuSup/>
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
        Contacto
      </Typography>
      <Typography variant="body1" gutterBottom>
        ¿Tienes alguna pregunta o necesitas más información? Contáctanos a través del siguiente formulario o usando nuestros datos de contacto.
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField 
          label="Nombre" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          label="Correo Electrónico" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          label="Mensaje" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          multiline 
          rows={4} 
        />
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Enviar
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Datos de Contacto
      </Typography>
      <Typography variant="body1">
        <strong>Dirección:</strong> Calle Falsa 123, Ciudad Ejemplo, País
      </Typography>
      <Typography variant="body1">
        <strong>Teléfono:</strong> +1 234 567 890
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> contacto@ejemplo.com
      </Typography>
    </Container>
    </div>
  );
}

export default Contacto;