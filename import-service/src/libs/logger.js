import winston from 'winston';

export default winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'import-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
