const { createLogger, format, transports } = require("winston");

/**
 * Service that the error originated from, if empty it will set the "server" as the origin of errors
 * @param {string} service 
 * @returns A winston logger object
 * @see https://github.com/winstonjs/winston
 */
const logger = (service = "server") => {
  const winston = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
      format.prettyPrint()
    ),
    defaultMeta: { service: service },
    transports: [
      //
      // - Write all logs with level `info` and below to `all.log`.
      // - Write all logs error (and below) to `error.log`.
      //
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/all.log" }),
    ],
  });
  //
  // If we're not in production then **ALSO** log to the `console`
  // with the colorized simple format.
  //
  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
          format.prettyPrint()
        ),
      })
    );
  }

  return winston;
};
module.exports = logger;
