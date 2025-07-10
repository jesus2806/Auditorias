//tasks > cronDeleteInactive.js

require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const Usuarios = require('../models/usuarioSchema');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB para tarea cron'))
.catch(err => {
  console.error('Error al conectar MongoDB:', err);
  process.exit(1);
});

cron.schedule('* * * * *', async () => {
  try {
    const umbral = new Date(Date.now() - 3 * 60 * 1000);

    // Busca usuarios inactivos
    const inactivos = await Usuarios.find({ lastActivity: { $lte: umbral } });

    if (inactivos.length > 0) {
      const ids = inactivos.map(u => u._id);
      // Borra todos de una vez
      await Usuarios.deleteMany({ _id: { $in: ids } });
      console.log(`Eliminadas ${inactivos.length} cuentas inactivas (${umbral.toISOString()})`);
    }
  } catch (error) {
    console.error('Error en tarea cron de borrado:', error);
  }
});
