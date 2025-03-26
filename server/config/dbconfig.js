const mongoose = require("mongoose");
const Usuarios = require('../models/usuarioSchema');

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.on('connected', async () => {
  console.log('Conexión exitosa a MongoDB');

  try {
    // Busca un usuario root
    const user = await Usuarios.findOne({ Correo: 'soleje2862004@gmail.com' });
    if (!user) {
      // Si no existe un usuario root, crea uno
      const rootUser = new Usuarios({
        Nombre: 'Jesús Soto Ledezma',
        FechaIngreso: new Date(),
        Correo: 'soleje2862004@gmail.com',
        Contraseña: 'root321',
        Puesto: 'Global',
        Departamento: 'Calidad',
        Escolaridad: 'TSU',
        TipoUsuario: 'administrador',
        area: 'general'
      });

      await rootUser.save();
      console.log("Usuario root creado");
    } else {
      console.log("Usuario root ya existe");
    }
  } catch (err) {
    console.error("Error al crear el usuario root:", err);
  }
});

mongoose.connect(MONGODB_URL)
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;

