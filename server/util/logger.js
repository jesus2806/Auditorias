const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Asegúrate de que la carpeta 'logs' exista
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'silly', // todos los niveles disponibles
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${level.toUpperCase()}] ${timestamp} ${message}`)
  ),
  transports: [
    new transports.Console(), // salida en consola
    new transports.File({
      filename: path.join(logDir, 'server.log') // ← nombre correcto
    })
  ]
});

module.exports = logger;
