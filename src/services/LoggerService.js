// שירות לוגים של המערכת.
// השירות עוזר לעקוב אחרי פעולות, אזהרות ושגיאות בזמן ריצה.

class LoggerService {
  constructor() {
    this.logs = [];
  }

  add(level, message, data = null) {
    const logItem = {
      level,
      message,
      data,
      createdAt: new Date().toISOString()
    };

    this.logs.push(logItem);

    if (level === "error") {
      console.error(message, data);
    } else if (level === "warn") {
      console.warn(message, data);
    } else {
      console.log(message, data);
    }

    return logItem;
  }

  info(message, data = null) {
    return this.add("info", message, data);
  }

  warn(message, data = null) {
    return this.add("warn", message, data);
  }

  error(message, data = null) {
    return this.add("error", message, data);
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const loggerService = new LoggerService();
export default LoggerService;
