const { createLogger, format, transports } = require('winston');
require("winston-mongodb");
const { combine, timestamp, label, prettyPrint } = format;

const { mongoose } = require("../models/mongo");
const logger = createLogger({
  level: "info",
  format: combine(
    format.json()
    ),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.MongoDB({
      db: mongoose.connection,
      collection: "logs",
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

module.exports = logger;