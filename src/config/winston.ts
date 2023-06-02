import { format, transports, LoggerOptions } from "winston";

const logConfiguration = (label: string): LoggerOptions => ({
  transports: [new transports.Console()],
  format: format.combine(
    format.label({
      label,
    }),
    format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    )
  ),
});

export default logConfiguration;