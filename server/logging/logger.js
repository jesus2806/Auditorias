const logger = createLogger({
  level: 'silly', // Cambiado para incluir TODOS los niveles
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${level.toUpperCase()}] ${timestamp} ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    })
  ]
});
